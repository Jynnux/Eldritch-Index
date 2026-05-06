import { AppDataSource } from '../dataSource.js';
import { Character } from '../entities/characterEntity.js';
import { CharacterShare } from '../entities/sharingEntity.js';

export const characterModel = {
  async createCharacter(
    // trackers/input fields
    userId: string,
    name: string,
    occupation: string,
    currentHealth: number,
    maxHealth: number,
    // core stats
    strength: number,
    dexterity: number,
    power: number,
    constitution: number,
    appearance: number,
    education: number,
    size: number,
    intelligence: number,
  ) {
    // get the repo
    const repo = AppDataSource.getRepository(Character);
    // make the char
    const character = repo.create({
      user: { id: userId },
      name,
      occupation,
      maxHealth,
      currentHealth,
      strength,
      dexterity,
      power,
      constitution,
      appearance,
      education,
      size,
      intelligence,
    });

    return await repo.save(character);
  },

  async deleteCharacter(characterId: string, userId: string) {
    const repo = AppDataSource.getRepository(Character);

    const result = await repo.delete({
      id: characterId,
      user: { id: userId },
    });

    return result;
  },
  async checkVisibility(userId: string, characterId: string) {
    const characterRepo = AppDataSource.getRepository(Character);
    const shareRepo = AppDataSource.getRepository(CharacterShare);

    // check character repo first for user ownership
    const owned = await characterRepo.findOne({
      where: {
        id: characterId,
        user: { id: userId },
      },
    });

    if (owned) return { allowed: true, character: owned };

    // check shared repo to see if a character is shared or not
    const shared = await shareRepo.findOne({
      where: {
        character: { id: characterId },
        user: { id: userId },
      },
      relations: ['character'],
    });

    if (shared) return { allowed: true, character: shared.character };

    // neither owned nor shared
    return { allowed: false, character: null };
  },
  async getCharactersForUser({
    userId,
    limit,
    offset,
  }: {
    userId: string;
    limit: number;
    offset: number;
  }) {
    const repo = AppDataSource.getRepository(Character);

    const [characters, total] = await repo.findAndCount({
      where: { user: { id: userId } },
      take: limit,
      skip: offset,
    });

    return { characters, total };
  },
};
