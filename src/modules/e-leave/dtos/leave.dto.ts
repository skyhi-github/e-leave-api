import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveApplicationDto {
  @ApiProperty({ example: '00937' })
  @IsEmail()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty({ example: 'MIS' })
  @IsString()
  @IsNotEmpty()
  department_name?: string;

  @ApiProperty({ example: '2024-06-11' })
  @IsString()
  @IsNotEmpty()
  start_date?: Date;

  @ApiProperty({ example: '2024-06-12' })
  @IsString()
  @IsNotEmpty()
  end_date?: Date;

  @ApiProperty({ example: 'Annual Leave' })
  @IsString()
  @IsNotEmpty()
  leave_type?: string;

  @ApiProperty({ example: '1 Day' })
  @IsString()
  @IsNotEmpty()
  duration?: string;

  @ApiProperty({ example: '2024-06-15' })
  @IsString()
  @IsNotEmpty()
  back_to_work_date?: Date;

  @ApiProperty({ example: 'Visit homeland' })
  @IsString()
  @IsNotEmpty()
  reason?: string;

  @ApiProperty({ example: '00937' })
  @IsString()
  @IsNotEmpty()
  approver_id?: string;
}

export class GetLeaveDto {
  @ApiProperty({ example: '4c96da1' })
  @IsString()
  @IsNotEmpty()
  hash_id: string;

}

export class DeleteLeaveDto {
  @ApiProperty({ example: '4c96da1' })
  @IsString()
  @IsNotEmpty()
  id: string;

}