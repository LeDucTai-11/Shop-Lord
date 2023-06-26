import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailService : MailerService) {

    }

    async sendResetPasswordMail(email: string,resetPasswordToken: string) {
        await this.mailService.sendMail({
            to: email,
            subject: 'Reset Password Token',
            template: './reset-password',
            context: {
                resetPasswordToken: resetPasswordToken
            }
        });
    }
}
