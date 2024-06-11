import {
    BaseEntity,
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity('leave_balance')
  export class LeaveBalance extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'varchar', name: 'user_id', length: 36, nullable: true })
    user_id: string;
  
    @Index()
    @Column({ type: 'varchar', name: 'employee_id', length: 10, nullable: true })
    employee_id: string;

    @Index()
    @Column({ type: 'int', name: 'sick_leave_balance', nullable: true })
    sick_leave_balance: number;

    @Index()
    @Column({ type: 'int', name: 'unpaid_leave_balance', nullable: true })
    unpaid_leave_balance: number;

    @Index()
    @Column({ type: 'int', name: 'annual_leave_balance', nullable: true })
    annual_leave_balance: number;
  
  }
  