import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MailService } from '../services/mail.service';

@ApiTags('✉️ Mail')
@Controller('v1/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Send Email' })
  @ApiParam({ name: 'email', required: true })
  @Post(':email')
  getUser(@Param() email){ 
    return this.mailService.sendMailManager(email);
  }

}
