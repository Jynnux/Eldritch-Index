import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sharing')
export class CharacterShare {
  // sharing id
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // each there can be many characterShare entities that each reference one character.
  @ManyToOne('Character', 'shares', {
    onDelete: 'CASCADE',
  })
  character: any;

  // same as above but for users
  @ManyToOne('User', 'sharedCharacters', {
    onDelete: 'CASCADE',
  })
  user: any;
}
