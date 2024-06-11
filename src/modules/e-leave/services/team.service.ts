import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { UserRepository } from '../repositories/user.repository';
@Injectable()
export class TeamService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}
  async getProfileByDepartment(department_name: any) {

    const employees = await this.employeeRepository.$findAll('department_name', department_name.department_name);

    const employee_ids = employees.map((employee) => {
      return employee.employee_id
    });

    const [users, profiles] = await Promise.all([
      this.userRepository.$findManyByEmployeeIds(employee_ids),
      this.profileRepository.$findManyByEmployeeIds(employee_ids)
    ])

    const team = users.map((user) => {
      const profile = profiles.find((p) => p.employee_id === user.employee_id);
      return {
        image: profile?.image,
        first_name: user.first_name,
      };
    })

    return team;
  }

}