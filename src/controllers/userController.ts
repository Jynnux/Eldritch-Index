import { Request, Response } from 'express';
import { z } from 'zod';
import { userModel } from '../models/userModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { userValidator } from '../validators/userValidator.js';

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = userValidator.parse(req.body);
      const newUser = await userModel.register(email, password);
      const { passwordHash, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error });
      }
      const { type, message } = parseDatabaseError(error);
      return res.status(500).json({ type: type, error: message });
    }
    return res.status(400).json({ type: 'how did you even get here...' });
  },
};
