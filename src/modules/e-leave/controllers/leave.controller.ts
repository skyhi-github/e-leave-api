import { Controller, Get, Post, Body, Req, Param } from '@nestjs/common';
import { LeaveService } from '../services/leave.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateLeaveApplicationDto } from '../dtos';
import { LeaveTrackService } from '../services/leave_track.service';

@ApiTags('🚶🚪Leave')
@Controller('v1/leave')
export class LeaveController {
  constructor(private ELeaveService: LeaveService,
              private leaveTrackService: LeaveTrackService

  ) {}

  @ApiOperation({ summary: 'Get Employee Leave Application' })
  @Get()
  list(@Req() req) {
    return this.ELeaveService.leaveApplication(req);
  }

  @ApiOperation({ summary: 'Track Leave Application By ID' })
  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID' })
  leaveTrack(@Param() id) {
    return this.leaveTrackService.getLeaveTrackByID(id);
  }

  @ApiOperation({ summary: 'Get Employee Leave Balance' })
  @Get('balance')
  balance( @Req() req ) {
    return this.ELeaveService.leaveBalance(req);
  }

  @ApiOperation({ summary: 'Create Leave Application' })
  @Post('create')
  create(@Body() body: CreateLeaveApplicationDto) {
    return this.ELeaveService.create(body);
  }
}
