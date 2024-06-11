import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { LeaveApplicationRepository } from '../repositories/leave.repository';
import { LeaveTrackService } from './leave_track.service';

@Injectable()
export class FileService {

    constructor (private readonly leaveApplicationRepository: LeaveApplicationRepository,
                 private readonly leaveTrackService: LeaveTrackService
    ) {}

    async downloadApprovalFile(id: any) {

        const leave = await this.leaveApplicationRepository.$findOne('id', id?.id);

        if (!leave) {

            throw new BadRequestException(`Invalid ID provided. Please check the leave application ID.`);
        }

        if (leave.status === 'HR Approved') {

            leave.status = 'Success'
            leave.save();
            await this.leaveTrackService.create(leave);
        }

            const path = `./png/${leave?.id}.png`;

            const file = createReadStream(join(process.cwd(), path))

            return new StreamableFile(file);
    
    }

}