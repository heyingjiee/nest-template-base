import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../logger/logger.module';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  @Inject()
  private readonly logger: CustomLogger;
  async use(req: Request, res: Response, next: () => void) {
    const { ip, method, originalUrl, headers, body } = req;

    this.logger.log(
      `[${method}][${originalUrl}][ip:<${ip}>][header:${JSON.stringify(headers)}][body:${JSON.stringify(body)}]`,
      '请求',
    );
    next();
  }
}
