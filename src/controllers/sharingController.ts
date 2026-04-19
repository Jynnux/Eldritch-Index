import { Request, Response } from 'express';
import { characterShareModel } from '../models/sharingModel.js';
import { ShareCharacterSchema } from '../validators/sharingValidator.js';

export const sharingController = {
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
};
