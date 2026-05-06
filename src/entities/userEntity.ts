import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterShare } from './sharingEntity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  // universally unique identifier; our primary key
  id: string;

  // one user may share many characters.
  @OneToMany(() => CharacterShare, (share) => share.user)
  sharedCharacters: CharacterShare[];

  // email address
  @Column({ unique: true })
  email!: string;

  // username
  @Column({ unique: true, nullable: true })
  displayName!: string;

  // password hash
  @Column()
  passwordHash!: string;
}
