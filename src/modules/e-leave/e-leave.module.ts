import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveController } from './controllers/leave.controller';
import { AuthController } from './controllers/auth.controller';
import { LeaveService } from './services/leave.service';
import { UserService } from './services/user.service';
import { User, LeaveApplication, LeaveBalance, Employee } from './entities';
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
import { ApprovalController } from './controllers/approval.controller';
import { MailService } from './services/mail.service';
import { LeaveBalanceRepository } from './repositories/leave-balance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, LeaveBalance, LeaveApplication, Employee, LeaveTrack])],
  providers: [LeaveService, UserService, AuthService, JwtService, EmployeeService, LeaveTrackService, EmployeeRepository, UserRepository, LeaveApplicationRepository, DynamicSvgService, FileService, ApprovalService, MailService, LeaveBalanceRepository, LeaveTrackRepository],
  controllers: [LeaveController, AuthController, UserController, EmployeeController, MailController, FileController, ApprovalController],
})
export class ELeaveModule {}
