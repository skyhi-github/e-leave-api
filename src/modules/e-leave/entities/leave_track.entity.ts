import {
  BaseEntity,
  Column,
  Entity,
  Index,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('leave_track')
@Unique(['employee_id', 'hash_id', 'leave_app_status'])
export class LeaveTrack extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', name: 'employee_id', length: 10, nullable: true })
  employee_id: string;

  @Index()
  @Column({ type: 'varchar', name: 'hash_id', length: 7, nullable: false })
  hash_id: string;

  @Index()
  @Column({ type: 'varchar', name: 'leave_app_status', length: 35, nullable: true })
  leave_app_status: string

  @Index()
  @Column({ type: 'timestamp', name: 'create_at', nullable: true })
  create_at: Date

}
