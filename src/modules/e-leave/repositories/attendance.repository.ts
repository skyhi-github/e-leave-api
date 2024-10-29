import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
  ) {}

  async $findOne<K extends keyof Employee>(key: K, value: Employee[K]): Promise<Employee | undefined> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getOne();
  }

  async $findAll<K extends keyof Employee>(key: K, value: Employee[K]) {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getMany();
  }

  async $findEmployeesByDepartment(departmentName: string): Promise<Employee[]> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    queryBuilder
      .leftJoinAndSelect('employee_employee_id', 'profile.employee_id')
      .where('employee.department_name = :departmentName', { departmentName });

    return await queryBuilder.getMany();
  }

  async $update(employeeId: string, data: Partial<Employee>): Promise<void> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    queryBuilder.where('employee_id = :employeeId', { employeeId });

    // Update the employee based on the query builder
    await queryBuilder.update().set(data).execute();
  }
}
