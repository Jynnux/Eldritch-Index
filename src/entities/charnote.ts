import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

/*
 CHARACTERNOTE - > ENTITIES
 Meant to overview notes/be an addenunm to character. Has no direct relation to other nodes aside
 from character sheet currently; ergo, implementing this first. userEntity loosely used as a ref.
*/
@Entity('characternotes')
export class CharacterNote {
  @PrimaryColumn('uuid')
  // UUID - Universally unique identifer
  id: string = uuidv7();

  @Column()
  // ID exclusive to character; Which character does this belong to?
  characterId!: string;

  @Column()
  // ID exclusive to author i.e. user, whoever owns the character
  ownerId!: string;

  @Column({ nullable: true })
  // Title of the note they wish to give
  title?: string;

  @Column('text')
  // Text belonging within the space
  content!: string;
}
