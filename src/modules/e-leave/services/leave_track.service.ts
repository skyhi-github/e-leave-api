import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveTrack } from '../entities/leave_track.entity';
import { Repository } from 'typeorm';
import { LeaveTrackRepository } from '../repositories/leave-track.repository';
import { dateFormatter, leave_track_color } from '../helpers/date-formatter';

@Injectable()
export class LeaveTrackService {
  constructor (
    @InjectRepository(LeaveTrack)
    private readonly leaveTrackRepository: Repository<LeaveTrack>,
    private readonly LeaveTrackRepository: LeaveTrackRepository
  ){}

  async create(body: any): Promise<LeaveTrack> {

    const newLeave = new LeaveTrack();

    newLeave.employee_id = body?.employee_id,
    newLeave.leave_app_id = body?.id,
    newLeave.leave_app_status = body?.status,
    newLeave.create_at = new Date(),

    await this.leaveTrackRepository.save(newLeave);

    return newLeave;
  };

  async getLeaveTrackByID(id) {

    const leaveTrack = await this.LeaveTrackRepository.$findAll('leave_app_id', id.id);

    leaveTrack.sort(function (a, b) {
      var key1 = new Date(a.create_at);
      var key2 = new Date(b.create_at);
  
      if (key1 > key2) {
          return -1;
      } else if (key1 == key2) {
          return 0;
      } else {
          return 1;
      }
  });

    const formatLeaveTrack = leaveTrack.map((track) => {

      return {
        ...track,
        create_at: dateFormatter(track?.create_at),
        color: leave_track_color(track?.leave_app_status)
      }

    })

    return formatLeaveTrack;

  };

}
