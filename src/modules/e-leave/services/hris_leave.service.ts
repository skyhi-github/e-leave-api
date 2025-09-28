import { Injectable, Query, Req } from '@nestjs/common';
import { DataSource  } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class HRISService {

  constructor( @InjectDataSource('hris') private dataSource: DataSource) {}

  async queryToppestLeaveApplication() {

    const latestLeave_No = `SELECT TOP (1) * FROM dbo.Leave ORDER BY dbo.Leave.Leave_Note_No DESC`;

    const data = await this.dataSource.query(latestLeave_No);

    return data;
  }

  async queryToppestLeaveApplicationLeaveNoteNoOnly() {

    const latestLeaveNo = `SELECT TOP (1) dbo.Leave.Leave_Note_No FROM dbo.Leave ORDER BY dbo.Leave.Leave_Note_No DESC`;

    const data = await this.dataSource.query(latestLeaveNo);

    const leaveNoteNo = data?.[0]?.Leave_Note_No;

    return leaveNoteNo;
  }

  async createLeaveApplication(Leave: Object) {

    const employee_shift_code = await this.getEmployeeShiftCode(Leave['employee_id']);
    const newLeaveNoteNo = await this.leaveNoteMaker();
    const Year_No = new Date(Leave['start_date']).getFullYear().toString();
    const formattedDate = new Date().toISOString().replace('T', ' ').split('.')[0] + '.000';
    const leaveFromDate = new Date(Leave['start_date']).toISOString().split('T')[0] + ' 00:00:00.000';
    const leaveFromTime = (new Date(Leave['start_date']).getHours().toString().padStart(2, '0') + new Date(Leave['start_date']).getMinutes().toString().padStart(2, '0'));
    const leaveToDate = new Date(Leave['end_date']).toISOString().split('T')[0] + ' 00:00:00.000';
    const leaveToTime = (new Date(Leave['end_date']).getHours().toString().padStart(2, '0') + new Date(Leave['end_date']).getMinutes().toString().padStart(2, '0'));
    const createLeaveApplication = `INSERT INTO BCAHRDB_UAT.dbo.Leave (Leave_Note_No,Leave_Date,Emp_No,From_Date,From_Time,To_Date,To_Time,Leave_Type,Leave_Minute1,Leave_Minute2,Days,shift_code1,shift_code2,Year_No)
	                                  VALUES (N'${newLeaveNoteNo}','${formattedDate}',N'${Leave['employee_id']}','${leaveFromDate}',N'${leaveFromTime}','${leaveToDate}',N'${leaveToTime}',N'AL ',0,480,0,N'${employee_shift_code} ',N'${employee_shift_code} ',N'${Year_No}');`;
    await this.dataSource.query(createLeaveApplication);
  }

  async getEmployeeShiftCode(employeeID: string) {

    const employee = `SELECT SHIFT_CODE FROM dbo.Employee WHERE dbo.Employee.Emp_No = '${employeeID}'`;

    const employeeShiftCode = await this.dataSource.query(employee);

    return employeeShiftCode[0].SHIFT_CODE;
  }

  async leaveNoteMaker() {
    const Leave_Note_No = await this.queryToppestLeaveApplicationLeaveNoteNoOnly();
    const prefix = Leave_Note_No.slice(0, 11);
    const sequence = Leave_Note_No.slice(11);
    const incrementedSequence = (parseInt(sequence) + 1).toString().padStart(4, '0');
    const newLeaveNoteNo = prefix + incrementedSequence;
    return newLeaveNoteNo;
  }

}