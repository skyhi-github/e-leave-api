import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@bowker.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '%Y0&`~(*#HE.?2' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '00937' })
  @IsEmail()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty({ example: '00937' })
  @IsEmail()
  @IsNotEmpty()
  manager_id: string;

  @ApiProperty({ example: 'MIS' })
  @IsEmail()
  @IsNotEmpty()
  department_name: string;

  @ApiProperty({ example: 'IT Support' })
  @IsEmail()
  @IsNotEmpty()
  position_name: string;

  @ApiProperty({ example: 'Mano' })
  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @ApiProperty({ example: 'Homa' })
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsOptional()
  role?: string;
}

export class EmployeeID {

  @ApiProperty({ example: '%Y0&`~(*#HE.?2' })
  @IsString()
  @IsNotEmpty()
  employee_id: string;

}

export class UpdatePasswordDto {

  @ApiProperty({ example: '%Y0&`~(*#HE.?2' })
  @IsString()
  @IsNotEmpty()
  password: string;

}
