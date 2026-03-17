import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  // universally unique identifier; our primary key
  id: string = uuidv7();

  // email address
  @Column({ unique: true })
  email!: string;

  // password hash
  @Column()
  passwordHash!: string;
}
