import { AppDataSource } from '../dataSource.js';
import { Character } from '../entities/characterEntity.js';
import { CharacterShare } from '../entities/sharingEntity.js';

export const characterModel = {
  async createCharacter(
    userId: string,
    name: string,
    occupation: string,
    currentHealth: number,
    maxHealth: number,
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
  // -- GABRIELLE TAUNTON --
  // CHOOSE STATS MODEL
  // Choose your stats method! Meant to be implemented in both rolling method and point buy.
  // Redirecting and actual flow occurs in front-end, this is an endpoint to check for user method.
  async choosestatuser(userId: string, characterId: string, statmethod: 'point-buy' | 'rolling') {
    // Getting the repo. Similar to other methods in CharacterModel here.
    const statrepo = AppDataSource.getRepository(Character);

    // Checking for char ownership. Referencing off of Justin's segment.
    const character = await statrepo.findOne({
      where: {
        id: characterId,
        user: { id: userId },
      },
    });
    // If character isn't the user's, no changes are allowed. Following format from other methods.
    if (!character) return { allowed: false };

    // Apply method based on what is chosen.
    character.charcreatestatmethod = statmethod;

    await statrepo.save(character);

    return {
      method: character.charcreatestatmethod,
    };
  },

  // -- GABRIELLE TAUNTON --
  // POINT BUY MODEL
  // Putting ACTUAL stats here. Strength, constitution, dexterity, appearance, education, size,
  // intelligence/ power, so on, so forth. Createmethod used as a vague guide (also to help Justin
  // when he hopefully updates the stats!). Rolling method will use these too.
  async pointbuyuser(
    characterId: string,
    userId: string,
    numstr: number,
    numcon: number,
    numdex: number,
    numapp: number,
    numedu: number,
    numsiz: number,
    numint: number,
    numpow: number,
  ) {
    // Getting the repo. Similar to other methods in CharacterModel here.
    const repo = AppDataSource.getRepository(Character);

    const character = await repo.findOne({
      where: {
        id: characterId,
        user: { id: userId },
      },
    });
    // If character isn't the user's, no changes are allowed. Following format from other methods.
    if (!character) return { allowed: false };
    // If user has NOT chosen point-buy, we do not let them do this. This line is from
    // charcreatestatmethod() in characterController, linking this all together. Endpoint works.
    if (character.charcreatestatmethod != 'point-buy') return { allowed: false };

    // Ensure they're within the 460 bound, no exceeding it!
    const total = numstr + numcon + numdex + numapp + numedu + numsiz + numint + numpow;
    if (total > character.pointbuytotal) return { allowed: false };

    // Applying character stats to character
    character.numstr = numstr;
    character.numcon = numcon;
    character.numdex = numdex;
    character.numapp = numapp;
    character.numedu = numedu;
    character.numsiz = numsiz;
    character.numint = numint;
    character.numpow = numpow;
    // Track the remaining points that can be distributed
    character.pointbuyremain = character.pointbuytotal - total;

    //Save the character state
    return await repo.save(character);
  },
  async rollinguser(characterId: string, userId: string) {
    // Getting the repo. Similar to other methods in CharacterModel here.
    const repo = AppDataSource.getRepository(Character);

    const character = await repo.findOne({
      where: {
        id: characterId,
        user: { id: userId },
      },
    });

    // If character isn't the user's, no changes are allowed. Following format from other methods.
    if (!character) return { allowed: false };
    // If user has NOT chosen rolling, we do not let them do this. This line is from
    // charcreatestatmethod() in characterController, linking this all together. Endpoint works.
    if (character.charcreatestatmethod != 'rolling') return { allowed: false };

    // This is to roll. Flatten rounds the number, while math.random does what it says on the tin.
    // Math.random() returns a floating-point number between (inclusive) and (exclusive), written as
    // a floating point number between 0 and 1. By multiplying this by 6, and using flatten to ensure
    // integers are whole (1, 2, 3, 4, 5, 6) we can get the ratio we need for stats. The +1 is there
    // to start from 1 instead of 0. Annotating this so I can understand the logic and remember.
    // Not a fan of how this is formatted but the code keeps correcting itself to look like this.
    const roll3d6 = () =>
      Math.floor(Math.random() * 6) +
      1 +
      Math.floor(Math.random() * 6) +
      1 +
      Math.floor(Math.random() * 6) +
      1;
    // We do a 2d6 as well as some stats are rolled with it. Some are 3d6, some are 2d6.
    // Formatting here was unfortunately done automatically, if only it could be more consistent.
    const roll2d6 = () => Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;

    // Applying character stats to character
    // In case anyone is confused about the multipler (i.e*5):  CoC rules for rolling stats!
    character.numstr = roll3d6() * 5;
    character.numcon = roll3d6() * 5;
    character.numdex = roll3d6() * 5;
    character.numapp = roll3d6() * 5;
    character.numedu = (roll3d6() + 3) * 5;
    character.numsiz = (roll2d6() + 6) * 5;
    character.numint = (roll2d6() + 6) * 5;
    character.numpow = roll3d6() * 5;

    //Save the character state
    return await repo.save(character);
  },
};
