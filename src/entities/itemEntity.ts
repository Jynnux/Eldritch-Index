import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Character', 'items', {
    onDelete: 'CASCADE',
  })
  character: any;

  @Column()
  name: string;

  @Column()
  description: string;
}
