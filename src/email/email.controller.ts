import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { responseSuccess } from '../utils/responseUtil';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get('send')
  async handleSendEmail() {
    await this.emailService.sendEmail();
    return responseSuccess(null);
  }
}
