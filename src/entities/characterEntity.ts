import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterShare } from './sharingEntity.js';
import { User } from './userEntity.js';

@Entity('characters')
export class Character {
  // i figured it would be better to use a uuid here in case of sharing; time will tell if i regret
  // this.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // one user may have many characters
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  // one character may have many items
  @OneToMany('Item', 'character')
  items: any[];

  // one character may be Characterd to many people
  @OneToMany(() => CharacterShare, (share) => share.character)
  shares: CharacterShare[];
  // character name

  @Column()
  name!: string;

  // character occupation
  @Column()
  occupation!: string;

  // maximum health for a character; maybe finess this into making max and
  // current health equal during character creation but idk.
  @Column({ default: 1 })
  maxHealth!: number;

  // current health
  @Column({ default: 1 })
  currentHealth!: number;
}
