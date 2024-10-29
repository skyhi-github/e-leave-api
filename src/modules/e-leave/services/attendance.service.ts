import { Injectable, Query, Req } from '@nestjs/common';
import { DataSource,  } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AttendanceReportQuery } from '../dtos';
import { JwtService } from '@nestjs/jwt';
import { dateFormatterNoTime } from '../helpers/date-formatter';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AttendanceService {

    constructor( @InjectDataSource('hris') private dataSource: DataSource,
                 private readonly jwtService: JwtService,
                 private readonly userRepository: UserRepository) {}

  async getAttendance(@Req() request,  @Query() Query: AttendanceReportQuery) {

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Missing or invalid JWT token');
    }
    const token = authHeader.split(' ')[1];
    const decoded = await this.jwtService.decode(token);
    const userId = decoded.sub;

    const user = await this.userRepository.$findOne('id', userId);

    const employee_id: any = user?.employee_id;

    const query = `SELECT Att_Date, Fr_Time1, To_Time1, Fr_Time2, To_Time2 FROM BCAHRDB.dbo.Attendance WHERE Emp_No = '${employee_id}' AND Att_Date BETWEEN '${Query.startDate}' AND '${Query.endDate}' ORDER BY Att_Date ASC`

    const data = await this.dataSource.query(query);

    const formatDate = data.map(att => {
      return {
        ...att,
        Att_Date: dateFormatterNoTime(att?.Att_Date),
      }
    })

    return formatDate;
  }

}