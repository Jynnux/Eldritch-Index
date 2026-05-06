import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource.js';
import { Character } from '../entities/characterEntity.js';
import { characterModel } from '../models/characterModel.js';
import { CharacterSchema } from '../validators/characterValidator.js';

export const characterController = {
  // createCharacter()
  //
  // Creates a character with a name, occupation, and stats.
  async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      if (!req.session.authenticatedUser) {
        res.sendStatus(401).json('Try logging in.');
        return;
      }

      const result = CharacterSchema.safeParse(req.body);
      // in case user types something invalid
      if (!result.success) {
        res.status(400).json('Invalid character field entries.');
        return;
      }

      const {
        name,
        occupation,
        currentHealth,
        maxHealth,
        strength,
        dexterity,
        power,
        constitution,
        appearance,
        education,
        size,
        intelligence,
      } = result.data;

      const stats = [
        strength,
        dexterity,
        power,
        constitution,
        appearance,
        education,
        size,
        intelligence,
      ];

      // enforce bounds
      for (const s of stats) {
        if (s < 15 || s > 90) {
          res.status(400).json({ message: 'Stats must be between 15 and 90' });
        }
      }

      // enforce total pool (460 above base 15)
      const totalSpent = stats.reduce((sum, val) => sum + (val - 15), 0);

      if (totalSpent > 460) {
        res.status(400).json({ message: 'Stat points exceed 460 limit' });
      }

      // get user id to assign users characters
      const userId = req.session.authenticatedUser.userId;
      // validate
      if (!userId) {
        res.status(401).json('Try logging in.');
        return;
      }

      // NOTE: maybe change default values.
      const character = await characterModel.createCharacter(
        userId,
        name,
        occupation,
        maxHealth ?? 1,
        currentHealth ?? 1,
        strength ?? 15,
        dexterity ?? 15,
        power ?? 15,
        constitution ?? 15,
        appearance ?? 15,
        education ?? 15,
        size ?? 15,
        intelligence ?? 15,
      );

      res.status(201).json(character);
    } catch (err) {
      console.error(err);
      res.sendStatus(500).json('Could not reach server.');
    }
  },
  // getCharacter()
  //
  // returns a character based on a user's owned characters.
  async getCharacter(req: Request, res: Response): Promise<void> {
    try {
      // validate first
      const userId = req.session.authenticatedUser.userId;
      if (!userId) {
        res.status(401).json('Try logging in.');
      }

      const characterId = req.params.id as string;

      const { allowed, character } = await characterModel.checkVisibility(userId, characterId);

      if (!allowed) {
        res.sendStatus(404);
      }

      res.json(character);
    } catch (err) {
      console.error(err);
      res.status(500).json('No connection to server.');
    }
  },
  // getManyCharacters()
  //
  // retrieves 8 characters a user owns at a time, allowing the frontend to
  // display them in a per-page format. i made this function very quickly so
  // beware of unexpected behavior.
  async getManyCharacters(req: Request, res: Response) {
    try {
      const userId = req.session.authenticatedUser.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Try logging in.' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const offset = (page - 1) * limit;

      const { characters, total } = await characterModel.getCharactersForUser({
        userId,
        limit,
        offset,
      });

      return res.json({
        characters,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to fetch characters' });
    }
  },
  // deleteCharacter()
  //
  // deletes a character based on the characterId. i struggled with this one
  // because using uuid to delete individual objects is a pain but because of
  // how our db works we may have to find another solution for this one later.
  async deleteCharacter(req: Request, res: Response) {
    try {
      const userId = req.session.authenticatedUser.userId;

      if (!userId) {
        return res.status(401).json('Try logging in.');
      }

      const characterId = req.params.id as string;
      const result = await characterModel.deleteCharacter(characterId, userId);
      // in case nothing changes; i think this can only occur if the character doesn't exist.
      if (result.affected === 0) {
        return res.status(404).json('Character not found.');
      }
      // success!!!
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json('No connection to server.');
    }
  },
  // updateCharacter()
  //
  // this updates one character attribute at a time. when using bruno, you must
  // route it through the character id. then, automatically, the body of the
  // request will be parsed for individual params to update. so you just pass
  // in health or occupation, no need to make specific functions for those
  // things.
  //
  // NOTE: if you enter some invalid field or some field that doesn't exist,
  // it doesn't actually update the db, even if bruno displays like it does.
  // maybe add some error checking here if we have time.
  async updateCharacter(req: Request, res: Response) {
    try {
      // validation
      const userId = req.session.authenticatedUser.userId;
      if (!userId) return res.status(401).json('Try logging in.');

      const characterId = req.params.id as string;

      const repo = AppDataSource.getRepository(Character);

      const character = await repo.findOne({
        where: { id: characterId, user: { id: userId } },
      });

      if (!character) return res.status(404).json('Character not found.');
      // logic
      Object.assign(character, req.body);
      const result = await repo.save(character);

      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Could not reach server.');
    }
  },
};
