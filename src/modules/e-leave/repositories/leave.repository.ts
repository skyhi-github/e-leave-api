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

  async $insert(data: Partial<LeaveApplication>): Promise<LeaveApplication> {
    try {
      const savedEntity = await this.LeaveApplicationRepository.save(data);
      return savedEntity;
    } catch (error) {
      console.error('Error saving to SQL:', error);
      throw error;
    }
  }

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

  async $findByDateRange(startDate?: Date, endDate?: Date): Promise<LeaveApplication[]> {
    const queryBuilder = this.LeaveApplicationRepository.createQueryBuilder('leave_application');

    queryBuilder.where('leave_application.start_date >= :startDate', { startDate });
    queryBuilder.andWhere('leave_application.end_date <= :endDate', { endDate });

    return queryBuilder.getMany();
  }

  async $delete<K extends keyof LeaveApplication>(key: K, value: LeaveApplication[K]) {
    const queryBuilder = this.LeaveApplicationRepository.createQueryBuilder('leave_application');

    queryBuilder.delete().from(queryBuilder.alias).where(`${key} = :value`, { value }).execute();

    return;
  }

}
