import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Character', 'notes', {
    onDelete: 'CASCADE',
  })
  character: any;

  @Column()
  content: string;
}
