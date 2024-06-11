import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { readFileSync, createReadStream, rename } from 'fs';
import Handlebars from "handlebars";
import { UserRepository } from '../repositories/user.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { LeaveApplicationRepository } from '../repositories/leave.repository';
import { LeaveService } from './leave.service';
import { DynamicSvgService } from './dynamic-svg.service';
import { dateFormatter, dateFormatterNoday, excelGetDate, excelGetTime } from '../helpers/date-formatter';
import * as sharp from 'sharp';
import * as ExcelJS from 'exceljs';
import 'dotenv/config';
import { LeaveTrackService } from './leave_track.service';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService,
              private readonly userRepository: UserRepository,
              private readonly employeeRepository: EmployeeRepository,
              private readonly LeaveApplicationRepository: LeaveApplicationRepository,
              private readonly LeaveTrackService: LeaveTrackService,
              @Inject(forwardRef(() => LeaveService))
              private readonly leaveApplicationService: LeaveService,
              private readonly svg: DynamicSvgService,
  ) {}

  async sendMailManager(mailPayload) {

    const leave = await this.LeaveApplicationRepository.$findOne('hash_id', mailPayload?.hash_id);

    const filePath = './src/modules/e-leave/html/manager-email.hbs';
    const html = readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(html);

    const data = {
      managerEmail: mailPayload?.managerEmail,
      managerName: mailPayload?.managerName,
      approver: mailPayload?.approver,
      managerId: mailPayload?.managerId,
      employeeId: mailPayload?.employeeId, 
      employeeName: mailPayload?.employeeName,
      employeePosition: mailPayload?.employeePosition,
      employeeEmail: mailPayload?.employeeEmail,
      department: mailPayload?.department,
      leaveType: mailPayload?.leaveType,
      startDate: mailPayload?.startDate,
      endDate: mailPayload?.endDate,
      duration: mailPayload?.duration,
      backToWork: mailPayload?.backToWork,
      reason: mailPayload?.reason,
      hash_id: mailPayload?.hash_id,
      link: mailPayload?.link,
      reject_link: mailPayload?.reject_link,
      createdAt: mailPayload?.createdAt
    };

    const compiled = template(data);

    this.mailService.sendMail({
      to: `${data?.managerEmail}`,
      from: `"E-Leave" <admin@manozagahostinger.online>`,
      cc: [`wama.skyhi@gmail.com`],
      subject: `${mailPayload?.employeeName} Leave Request`,
      html: compiled,
    })
    .then((res:any) => {
      console.log(res)
    })
    .catch((err:any) => {
      console.log('Error ',err)
    });

    return compiled;
  }

  async sendMailHR(id?: any, createdAt?: any) {

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

    const payloadData = {
      managerEmail: data?.managerEmail,
      managerName: data?.managerName,
      approver: data?.approver,
      managerId: data?.managerId,
      employeeId: data?.employeeId, 
      employeeName: data?.employeeName,
      employeePosition: data?.employeePosition,
      employeeEmail: data?.employeeEmail,
      department: data?.department,
      leaveType: leave?.leave_type,
      startDate: `${dateFormatterNoday(leave?.start_date)}`,
      endDate: `${dateFormatterNoday(leave?.end_date)}`,
      duration: leave?.duration,
      backToWork: `${dateFormatterNoday(leave?.back_to_work_date)}`,
      reason: leave?.reason,
      link: `${process.env.API_URL}/approve/${leave?.id}`,
      createdAt: `${dateFormatter(leave?.created_at)}`,
      hash_id: leave?.hash_id,
      approvedAt: createdAt,
      leaveRequestAt: `${dateFormatterNoday(leave?.created_at)}`,
      excelStartDate: `${excelGetDate(leave?.start_date)}`,
      excelStartTime: `${excelGetTime(leave?.start_date)}`,
      excelEndDate: `${excelGetDate(leave?.end_date)}`,
      excelEndTime: `${excelGetTime(leave?.end_date)}`,
    };

    await Promise.all([this.excelFileCreator(payloadData),
                       this.fileCreator(leave?.id)
    ]);

    const excelPath = `./xlsx/${payloadData?.hash_id}.xlsx`;

    const excel = readFileSync(excelPath);

    const compiled = template(payloadData);

    this.mailService.sendMail({
      to: [`sochea.kha@bowker-gfc.com.kh`],
      from: `"E-Leave" <admin@manozagahostinger.online>`,
      cc: [`wama.skyhi@gmail.com`],
      subject: `${user?.first_name} ${user?.last_name} Leave Request`,
      html: compiled,
      attachments: [
        {
          filename: `E-Leave-${payloadData?.employeeId}.xlsx`,
          content: excel,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ]
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

    const leave = await this.LeaveApplicationRepository.$findOne('id', id?.id)

    const employee = await this.employeeRepository.$findOne('employee_id', leave?.employee_id);

    const filePath = './src/modules/e-leave/html/self-email.hbs';
    const pngPath = `./src/png/${leave?.id}`
    const html = readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(html);

    leave.status = 'Success'
    leave.save();

    const payload = {

      employee_id: employee?.employee_id,
      hash_id: leave?.hash_id,
      receiver_type: 'download',
      approver_id: employee?.manager_id,
      leave_app_id: leave?.id,
      pngPath

    }

    const data = await this.leaveApplicationService.mailPayloadMaker(payload)

    const path = `./png/${leave?.id}.png`;

    const file = readFileSync(path)

    const compiled = template(data);

    this.mailService.sendMail({
      to: `${data?.employeeEmail}`,
      from: `"Leave Approved" <admin@manozagahostinger.online>`,
      cc: [`wama.skyhi@gmail.com`],
      subject: `Leave Request Approved`,
      html: compiled,
      attachments: [
        {
          filename: `E-Leave-${payload?.employee_id}.png`,
          content: file,
          contentType: 'image/png'
        }
      ]
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
        reason: `${leave?.reason ? leave?.reason : ''}`, 
    }

    const svg = await this.svg.generate(payload);

    sharp(svg).resize({width: 600, height: 850}).png({ quality: 100 }).toFile(`./png/${leave?.id}.png`, (err, info) => {
        if (err) {
        console.error('Error converting SVG to PNG:', err);
        } else {
        console.log('SVG successfully converted to PNG:', info);
        }
    })

    return `./png/${leave?.id}.png`;

  }

  async excelFileCreator(payload?: any) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leave Sheet');

    const data = [
      ['Employee No', 'Leave Type', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Leave Reason'],
      [payload?.employeeId, payload?.leaveType, payload?.excelStartDate, payload?.excelStartTime, payload?.excelEndDate, payload?.excelEndTime, payload?.reason]
    ]

    worksheet.addRows(data);

    await workbook.xlsx.writeFile(`./xlsx/${payload?.hash_id}.xlsx`);

  }

}
