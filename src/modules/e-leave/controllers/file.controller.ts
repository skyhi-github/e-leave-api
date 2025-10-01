import { MailService } from '../services/mail.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('🧑🏼‍💼 HR')
@Controller('v1/hr')
export class FileCreatorService {
  constructor(private mailService : MailService) {}

  @ApiOperation({ summary: 'Create Leave Application' })
  @Get('report')
  getLeaveReport(@Param('id') id: string) {
    return this.mailService.fileCreator(id);
  }
  
}