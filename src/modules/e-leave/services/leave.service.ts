import { Injectable, Req, Param, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateLeaveApplicationDto, DeleteLeaveDto, GetLeaveDto } from '../dtos';
import { LeaveApplication } from '../entities';
import { MailService } from './mail.service';
import { UserRepository } from '../repositories/user.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { LeaveApplicationRepository } from '../repositories/leave.repository';
import { JwtService } from '@nestjs/jwt';
import { LeaveBalanceRepository } from '../repositories/leave-balance.repository';
import { LeaveTrackRepository } from '../repositories/leave-track.repository';
import { dateFormatter } from '../helpers/date-formatter';
import { generateRandomString } from '../helpers/hash-generator'
import { LeaveTrackService } from './leave_track.service';
import { HRISService } from './hris_leave.service';
import 'dotenv/config';

@Injectable()
export class LeaveService {
  constructor (
    private readonly leaveApplicationRepository: LeaveApplicationRepository,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly jwtService: JwtService,
    private readonly leaveBalanceRepository: LeaveBalanceRepository,
    private readonly LeaveTrackRepository: LeaveTrackRepository,
    private readonly leaveTrackService: LeaveTrackService,
    private readonly HRISService: HRISService

  ){}

  async leaveApplication( @Req() request ) {

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Missing or invalid JWT token');
    }
    const token = authHeader.split(' ')[1];
    const decoded = await this.jwtService.decode(token);
    const userId = decoded.sub;

    const user = await this.userRepository.$findOne('id', userId);

    const employee_id: any = user?.employee_id;

    const [,leaveApplication] = await Promise.all([this.employeeRepository.$findOne('employee_id', employee_id),
                                                            this.leaveApplicationRepository.$findAll('employee_id', employee_id)]);
    
    const formatLeaveApplication = leaveApplication.map(leave => {
      return {
        ...leave,
        created_at: dateFormatter(leave?.created_at),
        start_date: dateFormatter(leave?.start_date),
        end_date: dateFormatter(leave?.end_date),
      }
    })

    return formatLeaveApplication;
  }

  async getLeaveByHashID( @Param() Param: GetLeaveDto ) {

    const leave = await this.leaveApplicationRepository.$findOne('hash_id', Param.hash_id)

    return {
      ...leave,
      start_date: dateFormatter(leave?.start_date),
      end_date: dateFormatter(leave?.end_date)
    };

  }

  async leaveBalance( @Req() request ) {

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Missing or invalid JWT token');
    }
    const token = authHeader.split(' ')[1];
    const decoded = await this.jwtService.decode(token);
    const userId = decoded.sub;

    const user = await this.userRepository.$findOne('id', userId);

    const employee_id: any = user?.employee_id;

    const leaveBalance = await this.leaveBalanceRepository.$findOne('employee_id', employee_id);

    return leaveBalance;
  }

  async create(body: CreateLeaveApplicationDto) {

    const newLeave = new LeaveApplication();

    newLeave.employee_id = body?.employee_id,
    newLeave.approver_id = body?.approver_id,
    newLeave.start_date = body?.start_date,
    newLeave.back_to_work_date = body?.back_to_work_date,
    newLeave.end_date = body?.end_date,
    newLeave.leave_type = body?.leave_type,
    newLeave.hash_id = await generateRandomString(),
    newLeave.duration = body?.duration,
    newLeave.reason = body?.reason,
    newLeave.status = 'Application Created'

    const leave = await this.leaveApplicationRepository.$insert(newLeave);
    this.HRISService.createLeaveApplication(leave);
    await this.leaveTrackService.create(newLeave);


    const payload = {

      employee_id: body?.employee_id,
      receiver_type: 'approve',
      approver_id: body?.approver_id,
      back_to_work_date: body?.back_to_work_date,
      hash_id: newLeave?.hash_id

    }

    // const leaveMailPayload = await this.mailPayloadMaker(payload);

    // await this.mailService.sendMailManager(leaveMailPayload);

    return leave;
  }

  async deleteLeaveApplication(@Param() id: DeleteLeaveDto) {

    const leaveApplication = await this.leaveApplicationRepository.$findOne('hash_id', id?.id);

    if (!leaveApplication) {
      throw new NotFoundException('Leave Application Not Found')
    }

    await Promise.all([
      this.leaveApplicationRepository.$delete('hash_id', id?.id),
      this.LeaveTrackRepository.$delete('hash_id', id?.id)
    ])

    return {
      statusCode: HttpStatus.OK,
      message: 'Leave Application deleted successfully!',
      data: id?.id,
    };

  }

  async mailPayloadMaker(application: any) {

    const { employee_id, receiver_type, approver_id, hash_id } = application;

    const user = await this.userRepository.$findOne('employee_id', employee_id);

    const [employee, leaveApplication] = await Promise.all([
        this.employeeRepository.$findOne('employee_id', employee_id),
        this.leaveApplicationRepository.$findOne('hash_id', hash_id)
      ]);

    const manager = await this.userRepository.$findOne('employee_id', approver_id);

    const leaveMailPayload = {

      managerEmail: manager?.email,
      managerName: `${manager?.first_name} ${manager?.last_name}`,
      approver: `${manager?.employee_id}`,
      managerId: manager?.employee_id,
      employeeId: user?.employee_id,
      employeeName: `${user?.first_name} ${user?.last_name}`,
      employeePosition: employee?.position_name,
      employeeEmail: user?.email,
      department: employee?.department_name,
      leaveType: `${leaveApplication?.leave_type}`,
      startDate: `${dateFormatter(leaveApplication?.start_date)  || ''}`,
      endDate: `${dateFormatter(leaveApplication?.end_date)}`,
      duration: `${leaveApplication?.duration || ''}`,
      backToWork: `${dateFormatter(leaveApplication?.back_to_work_date) || ''}`,
      reason: `${leaveApplication?.reason || '' }`,
      hash_id: `${leaveApplication?.hash_id}`,
      link: `${this.linkMaker(receiver_type, leaveApplication)}`,
      reject_link: `${this.linkMaker('reject', leaveApplication)}`,
      createdAt: `${dateFormatter(leaveApplication?.created_at)}`,
      approvedAt: '',
      fileUrl: application?.pngPath,

  };

    return leaveMailPayload;

  }

  linkMaker(receiver_type?: any, leaveApplication?: any) {

  if(receiver_type == 'approve') {
      return `${process.env.API_URL}/approve/${leaveApplication?.id}`;
  }

  if(receiver_type == 'reject') {
    return `${process.env.API_URL}/reject/${leaveApplication?.id}`;
  }

  if(receiver_type == 'download') {
      return `${process.env.API_URL}/file/${leaveApplication?.id}`;
  }

  }


}
