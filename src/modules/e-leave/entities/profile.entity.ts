import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('profile')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', name: 'employee_id', length: 10, nullable: true })
  employee_id: string;

  @Index()
  @Column({ type: 'varchar', name: 'username', length: 20, nullable: true })
  username: string;

  @Index()
  @Column({ type: 'varchar', name: 'sex', length: 1, nullable: true })
  sex: string;

  @Index()
  @Column({ type: 'varchar', name: 'image', length: 100, nullable: true })
  image: string;

  @Index()
  @Column({ type: 'varchar', name: 'phone', length: 15, nullable: true })
  phone: string;

  @Index()
  @Column({ type: 'varchar', name: 'id_no', length: 15, nullable: true })
  id_no: string;

  @Index()
  @Column({ type: 'date', name: 'dob', nullable: true })
  dob: string;

}
