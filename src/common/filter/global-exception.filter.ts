import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../logger/logger.module';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  @Inject()
  readonly logger: CustomLogger;

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    // 如果Error对象不小心漏到这里，是没有getStatus方法的，默认返回服务器内部错误
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = '服务器内部错误';
    const code = -1;
    // if ('cause' in exception) {
    //   // cause可以显示携带的子异常信息
    //   this.logger.error(
    //     `${JSON.stringify(exception.cause)} ${(exception.cause as Error).stack}`,
    //     GlobalExceptionFilter.name,
    //   );
    // }
    this.logger.error(
      `name:${exception.name}\n message:${exception.message}\n stack:${exception.stack}`,
      GlobalExceptionFilter.name,
    );

    // 确定抛出的是HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionRes = exception.getResponse() as
        | string
        | { message: string[] | string };

      if (typeof exceptionRes === 'object') {
        if (typeof exceptionRes.message === 'string') {
          // throw抛出具体的HttpException子类，例如NotFoundException、BadRequestException
          msg = exceptionRes.message;
        } else if (Array.isArray(exceptionRes.message)) {
          // ValidationPipe 校验参数错误，抛出的是BadRequestException，exception.message是Bad Request Exception。
          // 不能显示具体哪些字段错误了，但是有个response.message是个数组其中是ValidationPipe验证错误的提示。
          msg = exceptionRes.message[0];
        }
      } else {
        // throw new HttpException('xxx'),exceptionRes是字符串xxx
        msg = exceptionRes;
      }
    }

    const res = {
      code,
      data: null,
      msg,
    };
    this.logger.error(
      `[${request.method}][${request.originalUrl}][${status}]${JSON.stringify(res)}`, //
      '响应',
    );

    response.status(status).json(res);
  }
}
