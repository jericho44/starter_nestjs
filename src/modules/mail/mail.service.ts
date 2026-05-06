import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, template: string, context: any) {
    const templatePath = path.join(process.cwd(), 'templates', `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, context);

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to,
      subject,
      html: html as string,
    });
  }
}
