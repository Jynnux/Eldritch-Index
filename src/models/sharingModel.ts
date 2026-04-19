import { AppDataSource } from '../dataSource.js';
import { Character } from '../entities/characterEntity.js';
import { CharacterShare } from '../entities/sharingEntity.js';
import { User } from '../entities/userEntity.js';

export const characterShareModel = {
  async shareCharacter(characterId: string, ownerId: string, targetUserDisplayName: string) {
    const characterRepo = AppDataSource.getRepository(Character);
    const shareRepo = AppDataSource.getRepository(CharacterShare);
    const userRepo = AppDataSource.getRepository(User);

    // verify the character is owned
    const character = await characterRepo.findOne({
      where: { id: characterId, user: { id: ownerId } },
    });

    // throw error if user isn't owner of the character
    if (!character) {
      throw new Error('NOT_OWNER');
    }

    // check if target user exists
    const targetUser = await userRepo.findOne({
      where: { displayName: targetUserDisplayName },
    });

    if (!targetUser) {
      throw new Error('USER_NOT_FOUND');
    }

    // check to make sure the character isn't already shared with the user
    const alreadyShared = await shareRepo.findOne({
      where: { character: { id: characterId }, user: { displayName: targetUserDisplayName } },
    });

    // character is already shared
    if (alreadyShared) {
      throw new Error('ALREADY_SHARED');
    }

    // create new repo entry for sharing a character
    console.log('CHARACTER BEFORE:', character);
    const share = shareRepo.create({
      character: { id: characterId },
      user: { id: targetUser.id },
    });

    return await shareRepo.save(share);
  },
};
