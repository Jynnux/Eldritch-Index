import { AppDataSource } from '../dataSource.js';
import { CharacterNote } from '../entities/charnote.js';
/*
 CHARACTERNOTE - > MODEL
  Model portion; Utilized userModels as a loose reference when constructing. 
 - Update/Delete/etc would also need to be added here at a later date. 
*/
export const cNoteModel = {
  async create(data: Partial<CharacterNote>) {
    const repo = AppDataSource.getRepository(CharacterNote);
    const note = repo.create(data);
    return await repo.save(note);
  },

  async findByCharacter(characterId: string) {
    const repo = AppDataSource.getRepository(CharacterNote);
    return await repo.find({
      where: { characterId },
    });
  },
};
