import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApprovalService } from '../services/approval.service';


@ApiTags('👌 Approve')
@Controller('approve')
export class ApprovalController {

    constructor( private readonly approvalService: ApprovalService ) {}

    @ApiOperation({ summary: 'Approve Application' })
    @ApiParam({ name: 'id', required: true })
    @Get(':id')
    approveApplication(@Param() id){ 
      return this.approvalService.approve(id);
    }

}

@ApiTags('🙅 Reject')
@Controller('reject')
export class RejectController {

    constructor( private readonly approvalService: ApprovalService ) {}

    @ApiOperation({ summary: 'Approve Application' })
    @ApiParam({ name: 'id', required: true })
    @Get(':id')
    rejectApplication(@Param() id){
      return this.approvalService.reject(id);
    }

}
