import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource.js';
import { Character } from '../entities/characterEntity.js';
import { characterModel } from '../models/characterModel.js';
import { CharacterSchema } from '../validators/characterValidator.js';

export const characterController = {
  // createCharacter()
  //
  // creates a character. TODO: add important CoC stats later.
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

      const { name, health, maxHealth } = result.data;
      // get user id to assign users characters
      const userId = req.session.authenticatedUser.userId;
      // NOTE: maybe change default values.
      const character = await characterModel.createCharacter(
        userId,
        name,
        health ?? 10,
        maxHealth ?? 10,
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
  async getCharacter(req: Request, res: Response) {
    try {
      const userId = req.session.authenticatedUser?.userId;
      if (!userId) {
        return res.status(401).json('Try logging in.');
      }

      const repo = AppDataSource.getRepository(Character);
      // TODO: Quick fix--add authentication for this later.
      const characterId = req.params.id as string;

      const character = await repo.findOne({
        where: {
          id: characterId,
          user: { id: userId },
        },
      });

      if (!character) {
        return res.sendStatus(404);
      }

      return res.status(200).json(character);
    } catch (err) {
      console.error(err);
      res.sendStatus(500).json('No connection to server.');
    }
  },
  // deleteCharacter()
  //
  // deletes a character based on the characterId. i struggled with this one
  // because using uuid to delete individual objects is a pain but because of
  // how our db works we may have to find another solution for this one later.
  async deleteCharacter(req: Request, res: Response) {
    try {
      const userId = req.session.authenticatedUser?.userId;

      if (!userId) {
        return res.sendStatus(401).json('Try logging in.');
      }

      const characterId = req.params.id as string;
      const result = await characterModel.deleteCharacter(characterId, userId);
      // in case nothing changes; i think this can only occur if the character doesn't exist.
      if (result.affected === 0) {
        return res.sendStatus(404).json('Character not found.');
      }
      // success!!!
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json('No connection to server.');
    }
  },
};
