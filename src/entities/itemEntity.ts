import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {
  // item id; again with the uuids that suck to type.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // a character may have many items
  @ManyToOne('Character', 'items', {
    onDelete: 'CASCADE',
  })
  character: any;

  // name of item
  @Column()
  name: string;

  // description; for now, it is assumed we will put al data like damage or
  // effects here.
  @Column()
  description: string;
}
