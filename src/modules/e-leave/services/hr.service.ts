import { Injectable, Query } from '@nestjs/common';
import { LeaveReportParam } from '../dtos';
import { LeaveApplicationRepository } from '../repositories/leave.repository';
import { reportGetDate, reportGetTime } from '../helpers/date-formatter';

@Injectable()
export class HRService {

    constructor(
        private readonly LeaveApplicationRepository: LeaveApplicationRepository,
      ) {}

    async getLeaveReport (@Query() Query: LeaveReportParam) {

        const leaveApplication = await this.LeaveApplicationRepository.$findByDateRange(Query.startDate, Query.endDate);

        const formatLeaveApplication = leaveApplication.map(leave => {
            return {
              employee_id: leave.employee_id,
              leave_type: leave.leave_type,
              start_date: reportGetDate(leave?.start_date),
              start_time: reportGetTime(leave?.start_date),
              end_date: reportGetDate(leave?.end_date),
              end_time: reportGetTime(leave?.end_date),
              reason: leave.reason,
            }
          })

        return formatLeaveApplication;

    }

}
