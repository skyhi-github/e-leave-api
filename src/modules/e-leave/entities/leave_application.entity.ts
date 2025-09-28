import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity('leave_application')
  export class LeaveApplication extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Index()
    @Column({ type: 'varchar', name: 'employee_id', length: 10, nullable: true })
    employee_id: string;

    @Index()
    @Column({ type: 'varchar', name: 'hash_id', length: 7, nullable: true })
    hash_id: string;

    @Index()
    @Column({ type: 'varchar', name: 'leave_type', length: 20, nullable: true })
    leave_type: string;

    @Index()
    @Column({ type: 'timestamp', name: 'start_date', nullable: true })
    start_date: Date

    @Index()
    @Column({ type: 'timestamp', name: 'end_date', nullable: true })
    end_date: Date

    @Index()
    @Column({ type: 'timestamp', name: 'back_to_work_date', nullable: true })
    back_to_work_date: Date

    @Index()
    @Column({ type: 'varchar', name: 'duration', length: 30, nullable: true })
    duration: string;

    @Index()
    @Column({ type: 'varchar', name: 'reason', length: 100, nullable: true })
    reason: string;

    @Index()
    @Column({ type: 'varchar', name: 'status', length: 35, nullable: true })
    status: string;

    @Index()
    @Column({ type: 'varchar', name: 'approver_id', length: 10, nullable: true })
    approver_id: string;

    @Index()
    @Column({ type: 'varchar', name: 'hris_leave_note_no', length: 50, nullable: true })
    hris_leave_note_no: string;

    @Index()
    @CreateDateColumn({ type: 'timestamp', name: 'create_at', nullable: true })
    created_at: Date;

  }
