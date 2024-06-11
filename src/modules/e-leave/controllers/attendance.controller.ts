import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceReportQuery } from '../dtos';

@ApiTags('✅ Attendance')
@Controller('v1/attendance')
export class AttendanceController {

  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: 'Get Attendance' })
  @Get()
  async getAttendance( @Req() req,  @Query() Query: AttendanceReportQuery) {
      return this.attendanceService.getAttendance(req, Query);
  }
}
