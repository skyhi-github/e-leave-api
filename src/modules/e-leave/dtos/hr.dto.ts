import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LeaveReportParam {

  @ApiProperty({ example: '11-10-2024', required: false })
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @ApiProperty({ example: '20-10-2024', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
