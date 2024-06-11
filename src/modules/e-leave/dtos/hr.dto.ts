import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LeaveReportParam {

  @ApiProperty({ example: '2024-07-01', required: false })
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @ApiProperty({ example: '2024-09-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
