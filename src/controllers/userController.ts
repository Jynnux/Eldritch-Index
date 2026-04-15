import argon2 from 'argon2';
import { Request, Response } from 'express';
import { z } from 'zod';
import { userModel } from '../models/userModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateUserSchema, LogInUserSchema } from '../validators/userValidator.js';

export const userController = {
  async registerUser(req: Request, res: Response) {
    try {
      const { email, displayName, password } = CreateUserSchema.parse(req.body);
      const newUser = await userModel.createUser(email, displayName, password);
      const { passwordHash, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error });
      }
      const { type, message } = parseDatabaseError(error);
      return res.status(500).json({ type: type, error: message });
    }
  },
  async logIn(req: Request, res: Response): Promise<void> {
    const result = LogInUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json(result.error.flatten());
      return;
    }

    const { email, password } = result.data;

    try {
      const user = await userModel.getUserByEmail(email);
      if (!user) {
        req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
        res.sendStatus(403);
        return;
      }

      if (!(await argon2.verify(user.passwordHash, password))) {
        req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
        res.sendStatus(403);
        return;
      }

      // this line gave me errors when it was used.
      // await req.session.clearSession();
      req.session.authenticatedUser = { userId: user.id, email: user.email };
      req.session.isLoggedIn = true;

      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  async logOut(req: Request, res: Response): Promise<void> {
    // same deal here but when commented out kinda defeats the purpose of
    // this function. TODO: ask chris
    // await req.session.clearSession();
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(204);
    });
  },
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.session.authenticatedUser) {
        res.status(401).json('No session found.');
        return;
      }

      const userId = req.session.authenticatedUser.userId;
      const user = await userModel.getUserById(userId);

      if (!user) {
        res.sendStatus(404).json('No user found.');
        return;
      }
      // mfw i havent been removing the passwordhash every time
      const { passwordHash, ...safeUser } = user;
      res.status(200).json(safeUser);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  async deleteUser(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }
      // get user ID & delete session
      const userId = req.session.authenticatedUser.userId;
      await userModel.deleteUserById(userId);
      // freak out if some nonsense occurs
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
      });
      res.clearCookie('session');
      res.status(204).json('User successfully deleted.');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
};
