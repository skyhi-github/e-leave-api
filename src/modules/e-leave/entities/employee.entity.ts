import {
    BaseEntity,
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity('employee')
  export class Employee extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Index()
    @Column({ type: 'varchar', name: 'employee_id', length: 10, nullable: true })
    employee_id: string;

    @Index()
    @Column({ type: 'varchar', name: 'position_name', length: 30, nullable: true })
    position_name: string;

    @Index()
    @Column({ type: 'varchar', name: 'department_name', length: 40, nullable: true })
    department_name: string;

    @Index()
    @Column({ type: 'date', name: 'join_date', nullable: true })
    join_date: string;

    @Index()
    @Column({ type: 'varchar', name: 'manager_id', length: 10, nullable: true })
    manager_id: string;
  
  }
  