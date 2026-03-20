import { Request, Response } from 'express';
import { z } from 'zod';
import { cNoteModel } from '../models/cNoteModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { cNoteValidator } from '../validators/cNoteValidator.js';
/*
 CHARACTERNOTE - > CONTROLLER
 Meant to overview notes/be an addenunm to character. Has no direct relation to other nodes aside
 from character sheet currently; ergo, implementing this first. Create & find the specific note of 
 a character prioritized for the assignment right now. Include remove, update, userauth, later.
 userController loosely used as a reference.
*/
export const characterNoteController = {
  async create(req: Request, res: Response) {
    try {
      const data = cNoteValidator.parse(req.body);
      const note = await cNoteModel.create(data);
      return res.status(201).json(note);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error });
      }
      const { type, message } = parseDatabaseError(error);
      return res.status(500).json({ type, error: message });
    }
  },

  async getByCharacter(req: Request, res: Response) {
    try {
      const notes = await cNoteModel.findByCharacter;
      return res.json(notes);
    } catch (error: any) {
      const { type, message } = parseDatabaseError(error);
      return res.status(500).json({ type, error: message });
    }
  },
};
