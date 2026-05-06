import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource.js';
import { Note } from '../entities/noteEntity.js';
import { NoteSchema } from '../validators/noteValidator.js';

export const noteController = {
  // getNote()
  //
  // literally just displays the raw json of every note belonging to a
  // character.
  async getNotes(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        res.status(401).json('Try logging in.');
      }

      const characterId = req.params.id;

      const repo = AppDataSource.getRepository(Note);

      const notes = await repo.find({
        where: { character: { id: characterId } },
      });

      res.status(200).json(notes);
    } catch (err) {
      res.status(404).json('Notes not found.');
    }
  },
  // addNote()
  //
  // adds a single note to a character's inventory.
  async addNote(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }

      const characterId = req.params.id as string;

      const repo = AppDataSource.getRepository(Note);

      const parsed = NoteSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400);
      }

      const note = repo.create({
        character: { id: characterId },
        content: parsed.data.content,
      });

      const saved = await repo.save(note);

      return res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  },
  // updateNote()
  //
  // changes the content of a single note.
  async updateNote(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }

      const noteId = req.params.id as string;
      const parsed = NoteSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400);
      }

      const repo = AppDataSource.getRepository(Note);
      const note = await repo.findOne({
        where: { id: noteId },
      });

      if (!note) {
        return res.status(404).json('Note not found');
      }

      note.content = parsed.data.content;

      const updated = await repo.save(note);

      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  },
  // deleteNote()
  //
  // deletes a note from an inventory.
  async deleteNote(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }

      const noteId = req.params.id as string;

      const repo = AppDataSource.getRepository(Note);

      const result = await repo.delete({ id: noteId });

      if (result.affected === 0) {
        return res.status(404).json('Note not found');
      }

      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  },
};
