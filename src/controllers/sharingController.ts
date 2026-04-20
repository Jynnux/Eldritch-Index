import { Request, Response } from 'express';
import { characterShareModel } from '../models/sharingModel.js';
import { ShareCharacterSchema } from '../validators/sharingValidator.js';

export const sharingController = {
  // shareCharacterWithUser()
  //
  // shares one character with one user at a time by creating a shared object between two users and
  // one character.
  async shareCharacterWithUser(req: Request, res: Response) {
    try {
      // validate
      const userId = req.session.authenticatedUser?.userId;

      if (!userId) {
        return res.status(401).json('Try logging in.');
      }

      const parsed = ShareCharacterSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.sendStatus(400);
      }

      const { targetUserDisplayName } = parsed.data;
      const characterId = req.params.id as string;

      const result = await characterShareModel.shareCharacter(
        characterId,
        userId,
        targetUserDisplayName,
      );

      return res.status(201).json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json('Server issue.');
    }
  },
  // unshareCharacter()
  //
  // unshares one character with one user at a time by deleting entry in 'shared' db table.
  async unshareCharacter(req: Request, res: Response) {
    try {
      const userId = req.session.authenticatedUser?.userId;
      if (!userId) {
        return res.status(401).json('Try logging in.');
      }

      const parsed = ShareCharacterSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
      }

      const { targetUserDisplayName } = parsed.data;
      const characterId = req.params.id as string;

      await characterShareModel.unshareCharacter(characterId, userId, targetUserDisplayName);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server issue.');
    }
  },
};
