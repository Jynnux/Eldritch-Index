import argon2 from 'argon2';
import { Request, Response } from 'express';
import { z } from 'zod';
import { userModel } from '../models/userModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateUserSchema, LogInUserSchema } from '../validators/userValidator.js';

export const userController = {
  // registerUser()
  //
  // this function just makes a safeUser variable to return to the session.
  // notably, it removes passwordHash before returning anything.
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
  // logIn()
  //
  // compares an email and password to entried in the database. if two valid,
  // matching email and passwords are found, you are logged in. nuff said.
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

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  // logOut()
  //
  // just blow everything up who cares this doesn't have to be super in depth.
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
  // getUserProfile()
  //
  // returns non-critical profile information to the user. so sensitive stuff
  // like password hash should not ever be returned.
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.session.authenticatedUser) {
        res.status(401).json('Try logging in.');
      }

      const userId = req.session.authenticatedUser.userId;
      const user = await userModel.getUserById(userId);

      if (!user) {
        res.sendStatus(404).json('No user found.');
      }
      // mfw i havent been removing the passwordhash every time
      const { passwordHash, ...safeUser } = user;
      res.status(200).json(safeUser);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  // deleteUser()
  //
  // deletes a user based on their id. this should absolutely be more detailed
  // than that but we aren't at NASA right now or anything.
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
  // changeDisplayName()
  //
  // changes your display name. we may add other functionality to this function
  // later to change other attributes, but we may not.
  async changeDisplayName(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }
      const userId = req.session.authenticatedUser.userId;
      const { newName } = req.body;

      if (!newName) {
        return res.status(400).json('Enter a valid username.');
      }

      await userModel.changeDisplayName(userId, newName);

      return res.status(201).json('Display name successfully changed.');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
};
