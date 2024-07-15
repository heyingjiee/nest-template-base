import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmail() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: 'xxx@qq.com',
        pass: 'xxx',
      },
    });

    await transporter.sendMail({
      from: 'xxx@qq.com', // 这里必须和user字段一致
      to: 'xxx@xxx.com', // 目标地址
      subject: '测试邮件', // 标题
      text: '自动发送，请勿回复', // 内容
    });
  }
}
