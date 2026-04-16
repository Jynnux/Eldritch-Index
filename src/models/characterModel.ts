import { AppDataSource } from '../dataSource.js';
import { Character } from '../entities/characterEntity.js';

export const characterModel = {
  async createCharacter(userId: string, name: string, health: number, maxHealth: number) {
    // get the repo
    const repo = AppDataSource.getRepository(Character);
    // make the char
    const character = repo.create({
      user: { id: userId },
      name,
      health,
      maxHealth,
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
};
