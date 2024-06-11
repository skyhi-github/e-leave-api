import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveController } from './controllers/leave.controller';
import { AuthController } from './controllers/auth.controller';
import { LeaveService } from './services/leave.service';
import { UserService } from './services/user.service';
import { User, LeaveApplication, LeaveBalance, Employee, Profile } from './entities';
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { EmployeeController } from './controllers/employee.controller';
import { MailController } from './controllers/mail.controller';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { UserRepository } from './repositories/user.repository';
import { LeaveApplicationRepository } from './repositories/leave.repository';
import { LeaveTrackRepository } from './repositories/leave-track.repository';
import { LeaveTrackService } from './services/leave_track.service';
import { DynamicSvgService } from './services/dynamic-svg.service';
import { FileController } from './controllers/download.controller';
import { LeaveTrack } from './entities/leave_track.entity';
import { FileService } from './services/file.service';
import { ApprovalService } from './services/approval.service';
import { ApprovalController, RejectController } from './controllers/approval.controller';
import { MailService } from './services/mail.service';
import { LeaveBalanceRepository } from './repositories/leave-balance.repository';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { ProfileRepository } from './repositories/profile.repository';
import { TeamController } from './controllers/team.controller';
import { TeamService } from './services/team.service';
import { HRController } from './controllers/hr.controller';
import { HRService } from './services/hr.service';
import { AttendanceController } from './controllers/attendance.controller';
import { AttendanceService } from './services/attendance.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LeaveBalance, LeaveApplication, Employee, LeaveTrack, Profile, UserRepository])],
  providers: [LeaveService, UserService, AuthService, JwtService, EmployeeService, AttendanceService,
    LeaveTrackService, EmployeeRepository, UserRepository, LeaveApplicationRepository,
    DynamicSvgService, FileService, ApprovalService, MailService, LeaveBalanceRepository,
    LeaveTrackRepository, ProfileRepository, ProfileService, TeamService, HRService],

  controllers: [LeaveController, AuthController, UserController, HRController,
    ProfileController, EmployeeController, MailController, ApprovalController,
    RejectController, FileController, TeamController, AttendanceController],

})
export class ELeaveModule {}
