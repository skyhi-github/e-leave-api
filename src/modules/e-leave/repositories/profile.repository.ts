import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly ProfileRepository: Repository<Profile>,
  ) {}

  async $insert(data: Object): Promise<Profile | undefined> {

    try {
      const queryBuilder = this.ProfileRepository.createQueryBuilder('profile');
      const insertValues: { [key: string]: any } = {};

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          insertValues[key] = data[key];
        }
      }

      queryBuilder.insert().into('profile').values(data).execute();
  
      const savedEntity = await queryBuilder.getOne();
      return savedEntity;
    } catch (error) {
      console.error('Error saving to SQL:', error);
      return undefined;
    }
  }

  async $findOne<K extends keyof Profile>(key: K, value: Profile[K]): Promise<Profile | undefined> {
    const queryBuilder = this.ProfileRepository.createQueryBuilder('profile');

    queryBuilder.where(`${key} = :value`, { value });

    return await queryBuilder.getOne();
  }

  async $findAll<K extends keyof Profile>(key?: K, value?: Profile[K]) {
    const queryBuilder = this.ProfileRepository.createQueryBuilder('profile');

    if (key && value) {
      queryBuilder.where(`${key} = :value`, { value });
    }

    return await queryBuilder.getMany();
  }

  async $findManyByEmployeeIds(employee_ids: string[]): Promise<Profile[]> {
    const queryBuilder = this.ProfileRepository.createQueryBuilder('profile');

      queryBuilder.where('employee_id IN (:...employee_ids)', { employee_ids })
      return await queryBuilder.getMany();
  }


}
