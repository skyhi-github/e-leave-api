import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeaveApplicationDto } from '../dtos';
import { LeaveApplication } from '../entities';
import { Repository } from 'typeorm';
import { LeaveTrackService } from './leave_track.service';
import { MailService } from './mail.service';
import { UserRepository } from '../repositories/user.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { LeaveApplicationRepository } from '../repositories/leave.repository';
import { JwtService } from '@nestjs/jwt';
import { LeaveBalanceRepository } from '../repositories/leave-balance.repository';
import { dateFormatter } from '../helpers/date-formatter';
import 'dotenv/config';

@Injectable()
export class LeaveService {
  constructor (
    @InjectRepository(LeaveApplication) 
    private readonly leaveRepository: Repository<LeaveApplication>,
    private readonly LeaveApplicationRespsitory: LeaveApplicationRepository,
    private readonly leaveTrackService: LeaveTrackService,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly jwtService: JwtService,
    private readonly leaveBalanceRepository: LeaveBalanceRepository

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

    const [employee, leaveApplication] = await Promise.all([this.employeeRepository.$findOne('employee_id', employee_id),
                                                            this.LeaveApplicationRespsitory.$findAll('employee_id', employee_id)]);
    
    const formatLeaveApplication = leaveApplication.map(leave => {
      return {
        ...leave,
        created_at: dateFormatter(leave?.created_at),
        start_date: dateFormatter(leave?.start_date),
        end_date: dateFormatter(leave?.end_date),
        back_to_work_date: dateFormatter(leave?.back_to_work_date)
      }
    })

    

    return formatLeaveApplication;
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

  async create(body: CreateLeaveApplicationDto): Promise<LeaveApplication> {

    const newLeave = new LeaveApplication();

    newLeave.employee_id = body?.employee_id,
    newLeave.approver_id = body?.approver_id,
    newLeave.start_date = body?.start_date,
    newLeave.back_to_work_date = body?.back_to_work_date,
    newLeave.end_date = body?.end_date,
    newLeave.leave_type = body?.leave_type,
    newLeave.duration = body?.duration,
    newLeave.reason = body?.reason,
    newLeave.status = 'Application Created'

    const leave = await this.leaveRepository.save(newLeave);
  
    await this.leaveTrackService.create(newLeave)


    const payload = {

      employee_id: leave?.employee_id,
      receiver_type: 'approve',
      approver_id: body?.approver_id,
      leave_app_id: leave?.id,

    }

    const leaveMailPayload = await this.mailPayloadMaker(payload);

    await this.mailService.sendMailManager(leaveMailPayload);

    return leave;
  }

  async mailPayloadMaker(application: any) {

    const { employee_id, receiver_type, approver_id, leave_app_id } = application;



    const user = await this.userRepository.$findOne('employee_id', employee_id);

    const [employee, leaveApplication] = await Promise.all([
        this.employeeRepository.$findOne('employee_id', employee_id),
        this.LeaveApplicationRespsitory.$findOne('id', leave_app_id)
      ]);


    const manager = await this.userRepository.$findOne('employee_id', approver_id);

    const leaveMailPayload = {

      managerEmail: manager?.email,
      managerName: `${manager?.first_name} ${manager?.last_name}`,
      approver: `${manager?.employee_id}`,
      managerId: manager?.id,
      employeeId: user?.employee_id,
      employeeName: `${user?.first_name} ${user?.last_name}`,
      employeePosition: employee?.employee_id,
      employeeEmail: user?.email,
      department: employee?.department_name,
      leaveType: `${leaveApplication?.leave_type}`,
      startDate: `${dateFormatter(leaveApplication?.start_date)}`,
      endDate: `${dateFormatter(leaveApplication?.end_date)}`,
      duration: `${leaveApplication?.duration}`,
      backToWork: `${dateFormatter(leaveApplication.back_to_work_date)}`,
      reason: `${leaveApplication?.reason}`,
      link: `${this.linkMaker(receiver_type, leaveApplication)}`,
      createdAt: `${dateFormatter(leaveApplication?.created_at)}`,
      approvedAt: ''


  };

    return leaveMailPayload;

  }

  linkMaker(receiver_type: any, leaveApplication: any) {

  if(receiver_type == 'approve') {
      return `${process.env.API_URL}/approve/${leaveApplication?.id}`;
  }

  if(receiver_type == 'download') {
      return `${process.env.API_URL}/file/${leaveApplication?.id}`;
  }

  }


}
