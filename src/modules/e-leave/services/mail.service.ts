import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { readFileSync } from 'fs';
import Handlebars from "handlebars";
import { UserRepository } from '../repositories/user.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { LeaveApplicationRepository } from '../repositories/leave.repository';
import { LeaveService } from './leave.service';
import { DynamicSvgService } from './dynamic-svg.service';
import { dateFormatter, dateFormatterNoday } from '../helpers/date-formatter';
import * as sharp from 'sharp';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService,
              private readonly userRepository: UserRepository,
              private readonly employeeRepository: EmployeeRepository,
              private readonly LeaveApplicationRepository: LeaveApplicationRepository,
              @Inject(forwardRef(() => LeaveService))
              private readonly leaveApplicationService: LeaveService,
              private readonly svg: DynamicSvgService,
  ) {}

  async sendMailManager(mailPayload) {

    const filePath = './src/modules/e-leave/html/manager-email.hbs';
    const html = readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(html);

    const data = {
      managerEmail: mailPayload?.managerEmail,
      managerName: mailPayload?.managerName,
      approver: mailPayload?.approver,
      managerId: mailPayload?.managerId,
      employeeId: mailPayload?.employeeId, 
      employeeName: mailPayload?.employeeName, // Replace with actual name
      employeePosition: mailPayload?.employeePosition,
      employeeEmail: mailPayload?.employeeEmail,
      department: mailPayload?.department, // Replace with actual department
      leaveType: mailPayload?.leaveType, // Replace with actual leave type
      startDate: mailPayload?.startDate, // Replace with actual start date
      endDate: mailPayload?.endDate, // Replace with actual end date
      duration: mailPayload?.duration,
      backToWork: mailPayload?.backToWork, // Replace with actual back to work date
      reason: mailPayload?.reason, // Replace with actual remark (optional)
      link: mailPayload?.link,
      createdAt: mailPayload?.createdAt // Get current date and time
    };

    const compiled = template(data);

    this.mailService.sendMail({
      to: `${mailPayload?.managerEmail}`, // list of receivers
      from: `"E-Leave" <admin@manozagahostinger.online>`, // sender address
      cc: [],
      subject: `${mailPayload?.employeeName} Leave Request`, // Subject line
      html: compiled, // HTML body content
    })
    .then((res:any) => {
      console.log(res)
    })
    .catch((err:any) => {
      console.log('Error ',err)
    });

    return compiled;
  }

  async sendMailHR(id: any, createdAt: any) {

    const leave = await this.LeaveApplicationRepository.$findOne('id', id.id)

    const user = await this.userRepository.$findOne('employee_id', leave?.employee_id);
    const employee = await this.employeeRepository.$findOne('employee_id', leave?.employee_id);

    const filePath = './src/modules/e-leave/html/hr-email.hbs';
    const html = readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(html);


    const payload = {

      employee_id: user?.employee_id,
      receiver_type: 'approve',
      approver_id: employee?.manager_id,
      leave_app_id: leave?.id,

    }

    const data = await this.leaveApplicationService.mailPayloadMaker(payload);

    data.approvedAt = createdAt;

    const compiled = template(data);

    this.mailService.sendMail({
      to: `wama.skyhi@gmail.com`, // list of receivers
      from: `"E-Leave" <admin@manozagahostinger.online>`, // sender address
      cc: [],
      subject: `${user?.first_name} ${user?.last_name} Leave Request`, // Subject line
      html: compiled, // HTML body content
    })
    .then((res:any) => {
      console.log(res)
    })
    .catch((err:any) => {
      console.log('Error ',err)
    });

    return compiled;
  }

  async sendMailBack(id: any) {

    const leave = await this.LeaveApplicationRepository.$findOne('id', id.id)
    const employee = await this.employeeRepository.$findOne('employee_id', leave?.employee_id);

    const filePath = './src/modules/e-leave/html/self-email.hbs';
    const pngPath = `./src/png/${leave?.id}.png`
    const html = readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(html);

    const payload = {

      employee_id: employee?.employee_id,
      receiver_type: 'download',
      approver_id: employee?.manager_id,
      leave_app_id: leave?.id,

    }

    const data = await this.leaveApplicationService.mailPayloadMaker(payload)

    this.fileCreator(leave?.id);

    const compiled = template(data);

    this.mailService.sendMail({
      to: `${data?.employeeEmail}`, // list of receivers
      from: `"Leave Approved" <admin@manozagahostinger.online>`, // sender address
      cc: [],
      subject: `Leave Request Approved`, // Subject line
      html: compiled, // HTML body content
    })
    .then((res:any) => {
      console.log(res)
    })
    .catch((err:any) => {
      console.log('Error ',err)
    });

    

    return compiled;
  }

  async fileCreator(leaveId: any) {

    const leave = await this.LeaveApplicationRepository.$findOne('id', leaveId);

    const [user, employee] = await Promise.all([this.userRepository.$findOne('employee_id', leave?.employee_id), this.employeeRepository.$findOne('employee_id', leave?.employee_id)]);
    const manager = await this.userRepository.$findOne('employee_id', employee?.manager_id);

    const payload = {
        employeeId: `${employee?.employee_id}`,
        employeeName: `${user?.first_name} ${user?.last_name}`,
        employeePosition: `${employee?.position_name}`,
        department: `${employee?.department_name}`,
        leaveType: `${leave?.leave_type}`,
        startDate: `${dateFormatterNoday(leave?.start_date)}`,
        endDate: `${dateFormatterNoday(leave?.end_date)}`,
        duration: `${leave?.duration}`,
        backToWork: `${dateFormatter(leave?.back_to_work_date)}`,
        manager_name: `${manager?.first_name} ${manager?.last_name}`,
        reason: `${leave?.reason}`, 
    }

    const svg = await this.svg.generate(payload);

    sharp(svg).png({ quality: 100 }).toFile(`./png/${leave?.id}.png`, (err, info) => {
        if (err) {
        console.error('Error converting SVG to PNG:', err);
        } else {
        console.log('SVG successfully converted to PNG:', info);
        }
    })

    return `./png/${leave?.id}.png`;

  }

}