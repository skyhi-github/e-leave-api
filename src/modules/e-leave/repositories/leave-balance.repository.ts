import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveBalance } from '../entities';

@Injectable()
export class LeaveBalanceRepository {
  constructor(
    @InjectRepository(LeaveBalance)
    private readonly LeaveBalanceRepository: Repository<LeaveBalance>,
  ) {}

  async $findOne<K extends keyof LeaveBalance>(key: K, value: LeaveBalance[K]): Promise<LeaveBalance | undefined> {
    const queryBuilder = this.LeaveBalanceRepository.createQueryBuilder('leave_balance');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getOne();
  }
}
