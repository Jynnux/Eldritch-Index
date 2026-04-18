import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './userEntity.js';

@Entity('characters')
export class Character {
  // i figured it would be better to use a uuid here in case of sharing; time will tell if i regret
  // this.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany('Item', 'character')
  items: any[];

  @Column()
  name!: string;

  @Column()
  occupation!: string;

  @Column({ default: 1 })
  maxHealth!: number;

  @Column({ default: 1 })
  currentHealth!: number;
}
