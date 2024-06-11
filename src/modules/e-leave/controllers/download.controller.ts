import { Controller, HttpCode, HttpStatus, Get, Header, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FileService } from '../services/file.service';


@ApiTags('📁 File')
@Controller('file')
export class FileController {

    constructor( private readonly fileService: FileService ) {}

    @ApiOperation({ summary: 'Download Approved Document PNG' })
    @ApiParam({ name: 'id', required: true })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/png')
    @Header('Content-Disposition', 'attachment; filename=approved.png')
    pdf(@Param() id) {
        return this.fileService.downloadApprovalFile(id);
    }

}
