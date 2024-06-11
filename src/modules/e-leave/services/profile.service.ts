import { Body, Injectable } from '@nestjs/common';
import { CreateProfileDto } from '../dtos/profile.dto';
import { ProfileRepository } from '../repositories/profile.repository';
import { readFileSync } from 'fs';
import { EmployeeRepository } from '../repositories/employee.repository';
import { dateFormatterDOB } from '../helpers/date-formatter';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  async createProfile(@Body() profile: CreateProfileDto) {

    const filePath = './src/modules/e-leave/json/info.json';
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));

    const userProfiles = data.map(profile => ({
      employee_id: profile.employee_id,
      join_date: new Date(profile.JOIN_DATE),
    }))

    await userProfiles.forEach(profile => {
      this.employeeRepository.$update(profile?.employee_id, profile)
    });

    return userProfiles;
  }

  async getProfile(id) {

    const profile = await this.profileRepository.$findOne('employee_id', id?.id);

    profile.dob = dateFormatterDOB(profile?.dob);

    return profile;
  }

  async getProfileByDepartment(department_name: any) {

    const employees = await this.employeeRepository.$findEmployeesByDepartment(department_name?.id);

    return employees;
  }

}