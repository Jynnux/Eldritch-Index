import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  // universally unique identifier; our primary key
  id: string;

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
