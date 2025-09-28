import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HRISService } from '../services/hris_leave.service';

@ApiTags('🤝 HRIS Leave')
@Controller('v1/hris/leave')
export class HRISController {

  constructor(private readonly service: HRISService) {}

  @ApiOperation({ summary: 'Get HRIS Latest Leave Application' })
  @Get()
  async queryToppestLeaveApplication() {
      return this.service.queryToppestLeaveApplication();
  }

  @ApiOperation({ summary: 'Get HRIS Latest Leave Application Leave Note No Only' })
  @Get('/leave_note_no_only')
  async queryToppestLeaveApplicationLeaveNoteNoOnly() {
      return this.service.queryToppestLeaveApplicationLeaveNoteNoOnly();
  }

  @ApiOperation({ summary: 'New Leave Note No' })
  @Get('/new_leave_note_no')
  async queryNewLeaveNoteNo() {
      return this.service.leaveNoteMaker();
  }

  // @ApiOperation({ summary: 'Get HRIS Employee Shift Code' })
  // @Get('/employee_shift_code')
  // async getEmployeeShiftCode() {
  //     return this.service.getEmployeeShiftCode();
  // }

}
