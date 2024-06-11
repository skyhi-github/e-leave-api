import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async $findOne<K extends keyof User>(key: K, value: User[K]): Promise<User | undefined> {
    const queryBuilder = this.UserRepository.createQueryBuilder('user');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getOne();
  }

  async $findAll<K extends keyof User>(key?: K, value?: User[K]) {
    const queryBuilder = this.UserRepository.createQueryBuilder('user');

    if (key && value) {
      queryBuilder.where(`${key} = :value`, { value });
    }

    return await queryBuilder.getMany();
  }

  async $findManyByEmployeeIds(employee_ids: string[]): Promise<User[]> {
    const queryBuilder = this.UserRepository.createQueryBuilder('user');

      queryBuilder.where('employee_id IN (:...employee_ids)', { employee_ids })
      return await queryBuilder.getMany();
  }

  async $updatePassword(employee_id: string, data: Partial<User>): Promise<void> {
    const queryBuilder = this.UserRepository.createQueryBuilder('employee');

    queryBuilder.where('employee_id = :employee_id', { employee_id });

    // Update the employee based on the query builder
    await queryBuilder.update().set(data).execute();
  }

}
