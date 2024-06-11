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

  async $insert(data: object): Promise<LeaveTrack | undefined> {

    try {
      const queryBuilder = this.LeaveTrackRepository.createQueryBuilder('leave_track');
  
      const insertValues: { [key: string]: any } = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          insertValues[key] = data[key];
        }
      }

      queryBuilder.insert().into('leave_track').values(insertValues).execute();

      const savedEntity = await queryBuilder.getOne();
      return savedEntity;
    } catch (error) {
      console.error('Error saving to SQL:', error);
      return undefined;
    }
  }

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

  async $delete<K extends keyof LeaveTrack>(key: K, value: LeaveTrack[K]) {
    const queryBuilder = this.LeaveTrackRepository.createQueryBuilder('leave_track');

    queryBuilder.delete().from(queryBuilder.alias).where(`${key} = :value`, { value }).execute();

    return;
  }
}
