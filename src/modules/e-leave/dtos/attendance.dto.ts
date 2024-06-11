import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AttendanceReportQuery {

  @ApiProperty({ example: '2024-07-01', required: true })
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @ApiProperty({ example: '2024-10-31', required: true })
  @IsNotEmpty()
  @IsDateString()
  endDate!: Date;
}
