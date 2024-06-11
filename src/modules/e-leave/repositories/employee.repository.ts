import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async $findOne<K extends keyof Employee>(key: K, value: Employee[K]): Promise<Employee | undefined> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getOne();
  }
}
