import { Injectable, HttpException, HttpStatus, Param, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { CreateUserDto } from '../dtos';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from '../repositories/employee.repository';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly employeeService: EmployeeService,
    private readonly EmployeeRepository: EmployeeRepository,
    private readonly UserRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async getAllUser(){

    const allUser = await this.userRepository.find();

    return await this.userRepository.find();
  }

  async getFullUser( @Req() request ) {

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Missing or invalid JWT token');
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];

    // Verify and decode the token using the secret key
    const decoded = await this.jwtService.decode(token);;

    // Extract userId from the decoded payload (assuming you store userId in the JWT)
    const userId = decoded.sub;

    const user = await this.UserRepository.$findOne('id', userId);

    const employee_id: any = user?.employee_id;

    const employee = await this.EmployeeRepository.$findOne('employee_id', employee_id);

    const manager = await this.UserRepository.$findOne('employee_id', employee?.manager_id );
    const manager_name = `${manager?.last_name}` + ` ` + `${manager?.first_name}`;

    const data = {

      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name,
      employee_id: employee?.employee_id,
      manager_email: manager?.email,
      department_name: employee?.department_name,
      manager_name,
      manager_id: employee?.manager_id, 
    }

    return data;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    newUser.email = createUserDto.email;

    // Hash password before saving (assuming password is not already hashed)
    newUser.password = await bcrypt.hash(createUserDto.password, 10);

    newUser.employee_id = createUserDto.employee_id;
    newUser.first_name = createUserDto.first_name;
    newUser.last_name = createUserDto.last_name;

    let employee = {

      manager_id: createUserDto?.manager_id,
      employee_id: createUserDto?.manager_id,
      position_name: createUserDto?.position_name,
      department_name: createUserDto?.department_name
    }

    await this.employeeService.create(employee);

    return await this.userRepository.save(newUser); // Save user to database
  }

  async validateUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {

    const validationErrors = await validate(createUserDto); // Use class-validator

    if (validationErrors.length > 0) {
      throw new HttpException('Validation failed: ' + validationErrors.join(', '), HttpStatus.BAD_REQUEST);
    }

    // Additional validation logic here (e.g., check for unique email)
    // ...

    return createUserDto; // Return the validated user object
  }
}