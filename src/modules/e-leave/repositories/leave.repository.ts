import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveApplication } from '../entities';

@Injectable()
export class LeaveApplicationRepository {
  constructor(
    @InjectRepository(LeaveApplication)
    private readonly LeaveApplicationRepository: Repository<LeaveApplication>,
  ) {}

  async $findOne<K extends keyof LeaveApplication>(key: K, value: LeaveApplication[K]): Promise<LeaveApplication | undefined> {
    const queryBuilder = this.LeaveApplicationRepository.createQueryBuilder('leave_application');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getOne();
  }

  async $findAll<K extends keyof LeaveApplication>(key: K, value: LeaveApplication[K]) {
    const queryBuilder = this.LeaveApplicationRepository.createQueryBuilder('leave_application');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getMany();
  }
}
