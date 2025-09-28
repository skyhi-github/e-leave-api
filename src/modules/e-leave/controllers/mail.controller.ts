import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MailService } from '../services/mail.service';

@ApiTags('✉️ Mail')
@Controller('v1/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Manual Send Mail To Manager' })
  @ApiParam({ name: 'hash_id', required: true })
  @Post('leave_id/:hash_id')
  manualMailToManager(@Param() hash_id){ 
    return this.mailService.manualMailManager(hash_id);
  }

  @ApiOperation({ summary: 'Send Email To Manager' })
  @ApiParam({ name: 'email', required: true })
  @Post('manager/:email')
  sendMailToManager(@Param() email){ 
    return this.mailService.sendMailManager(email);
  }

  @ApiOperation({ summary: 'Send Email To HR' })
  @ApiParam({ name: 'email', required: true })
  @Post('hr/:email')
  sendMailToHR(@Param() email){ 
    return this.mailService.sendMailHR(email);
  }

  @ApiOperation({ summary: 'Send Email To Owner' })
  @ApiParam({ name: 'id', required: false })
  @Post('owner/:id')
  sendMailToOwner(@Param() id){ 
    return this.mailService.sendMailBack(id);
  }

}
