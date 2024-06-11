import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTrack } from '../entities';

@Injectable()
export class LeaveTrackRepository {
  constructor(
    @InjectRepository(LeaveTrack)
    private readonly LeaveTrackRepository: Repository<LeaveTrack>,
  ) {}

  async $findOne<K extends keyof LeaveTrack>(key: K, value: LeaveTrack[K]): Promise<LeaveTrack | undefined> {
    const queryBuilder = this.LeaveTrackRepository.createQueryBuilder('leave_track');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getOne();
  }

  async $findAll<K extends keyof LeaveTrack>(key: K, value: LeaveTrack[K]) {
    const queryBuilder = this.LeaveTrackRepository.createQueryBuilder('leave_track');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getMany();
  }
}
