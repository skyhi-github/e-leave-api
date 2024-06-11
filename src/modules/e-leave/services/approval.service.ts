import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { readFileSync } from 'fs';
import { LeaveApplicationRepository } from '../repositories/leave.repository';
import { MailService } from './mail.service';
import { LeaveTrackService } from './leave_track.service';

@Injectable()
export class ApprovalService {


    constructor(private readonly LeaveApplicationRepository: LeaveApplicationRepository,
                @Inject(forwardRef(() => MailService))
                private readonly mailService: MailService,
                private readonly LeaveTrackService: LeaveTrackService,
    ){}

    async reject(id: any) {

        const leave = await this.LeaveApplicationRepository.$findOne('id', id.id);
        const not_found_html = readFileSync('./src/modules/e-leave/html/not-found.hbs', 'utf-8');

        if (!leave) {

            return not_found_html;

        }

        const defaultHTMLfilePath = './src/modules/e-leave/html/reject.hbs'
        const alreadyApprove = './src/modules/e-leave/html/already_approve.hbs';

        let html = readFileSync(defaultHTMLfilePath, 'utf-8');

        if (leave.status === 'Manager Approved' || leave.status === 'Success') {
            html = readFileSync(alreadyApprove, 'utf-8');
            return html;
        }

        if (leave.status === 'Application Created') {
            html = readFileSync(defaultHTMLfilePath, 'utf-8');
            leave.status = 'Rejected';
            leave.save();
            await Promise.all([this.LeaveTrackService.create(leave)]);
            return html;
        }

        if (leave.status === 'Rejected') {
            html = readFileSync(defaultHTMLfilePath, 'utf-8');
            return html;
        }

        html = readFileSync(defaultHTMLfilePath, 'utf-8')

        return html;
    }

    async approve(id: any) {

        const leave = await this.LeaveApplicationRepository.$findOne('id', id.id);
        const not_found_html = readFileSync('./src/modules/e-leave/html/not-found.hbs', 'utf-8');

        if (!leave) {

            return not_found_html;

        }

        const managerHTMLfilePath = './src/modules/e-leave/html/thank-manager-approval.hbs';
        const hrHTMLfilePath = './src/modules/e-leave/html/thank-hr-approval.hbs';
        const defaultHTMLfilePath = './src/modules/e-leave/html/approved.hbs'
        const date = new Date()

        let html = readFileSync(managerHTMLfilePath, 'utf-8');

        if (leave.status === 'Application Created') {
            html = readFileSync(managerHTMLfilePath, 'utf-8');
            leave.status = 'Manager Approved';
            leave.save();
            await Promise.all([this.mailService.sendMailHR(id, this.formatDate(date)), this.LeaveTrackService.create(leave)]);
            return html;
        }

        if (leave.status === 'Manager Approved'){
            html = readFileSync(hrHTMLfilePath, 'utf-8');
            leave.status = 'HR Approved'
            leave.save();
            await this.LeaveTrackService.create(leave);
            await this.mailService.sendMailBack(id);
            return html;
        }

        html = readFileSync(defaultHTMLfilePath, 'utf-8')

        return html;
    }

    formatDate(dateString) {

    const date = new Date(dateString);
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const day = date.getDay();
    const hour = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const adjustedHours = hour % 12 || 12;
    
    const formattedDate = date.toLocaleDateString('en-US');
    
    const dateAndTime = `${daysOfWeek[day]} ${formattedDate} ${adjustedHours}:${minutes} ${ampm}`
    
    return dateAndTime;
    }

}