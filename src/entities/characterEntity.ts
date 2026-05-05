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

  // -- GABRIELLE TAUNTON --
  // POINT BUY & ROLLING: LET THE USER PICK WHICH!
  @Column({ nullable: true })
  charcreatestatmethod!: 'point-buy' | 'rolling';

  @Column({ default: 460 })
  pointbuytotal!: number;

  @Column({ default: 460 })
  pointbuyremain!: number;

  // Adding other stats i.e. constitution, strength, similar to what's in point-buy.
  // leaving all other things untouched. You may choose to adjust this later.
  @Column({ default: 0 })
  numstr!: number;

  @Column({ default: 0 })
  numcon!: number;

  @Column({ default: 0 })
  numdex!: number;

  @Column({ default: 0 })
  numapp!: number;

  @Column({ default: 0 })
  numedu!: number;

  @Column({ default: 0 })
  numsiz!: number;

  @Column({ default: 0 })
  numint!: number;

  @Column({ default: 0 })
  numpow!: number;
}
