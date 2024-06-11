import { Controller, Get, Query } from '@nestjs/common';
import { HRService } from '../services/hr.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeaveReportParam } from '../dtos';

@ApiTags('🧑🏼‍💼 HR')
@Controller('v1/hr')
export class HRController {
  constructor(private hrService : HRService) {}

  @ApiOperation({ summary: 'Create Leave Application' })
  @Get('report')
  getLeaveReport(@Query() Query: LeaveReportParam) {
    return this.hrService.getLeaveReport(Query);
  }

}
