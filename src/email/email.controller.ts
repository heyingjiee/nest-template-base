import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { responseSuccess } from '../utils/responseUtil';
import { ApiOperation } from '@nestjs/swagger';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @ApiOperation({ summary: '发送邮件示例', description: '' })
  @Get('send')
  async handleSendEmail() {
    await this.emailService.sendEmail();
    return responseSuccess(null);
  }
}
