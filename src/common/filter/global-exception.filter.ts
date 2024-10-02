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
import { ResponseType } from '@/common/type/response.interface';

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
    let message = '服务器内部错误';
    let code = '010000';
    let data = null;
    // if ('cause' in exception) {
    //   // cause可以显示携带的子异常信息
    //   this.logger.error(
    //     `${JSON.stringify(exception.cause)} ${(exception.cause as Error).stack}`,
    //     GlobalExceptionFilter.name,
    //   );
    // }
    this.logger.error(
      `name:${exception.name} | message:${exception.message} | stack:${exception.stack}`,
      GlobalExceptionFilter.name,
    );

    // 确定抛出的是HttpException
    // 注意： HttpException(xxx,HttpStatus.OK)，xxx 类型是 response: string | Record<string, any>，通过exception.getResponse获取
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionRes = exception.getResponse() as
        | string
        | Record<string, any>;

      if (typeof exceptionRes === 'object') {
        // code
        if (exceptionRes.code) {
          code = exceptionRes.code;
        }

        // data
        if (exceptionRes.data) {
          data = exceptionRes.data;
        }

        // message
        if (typeof exceptionRes.message === 'string') {
          // throw抛出具体的HttpException子类，例如NotFoundException、BadRequestException。xxx是字符串
          message = exceptionRes.message;
        } else if (Array.isArray(exceptionRes.message)) {
          // ValidationPipe 校验参数错误，抛出的是BadRequestException，exception.message是Bad Request Exception。
          // 不能显示具体哪些字段错误了，但是有个response.message是个数组其中是ValidationPipe验证错误的提示。
          message = exceptionRes.message[0];
        }
      } else {
        message = exceptionRes;
      }
    }

    const res: ResponseType = {
      code,
      data,
      message,
    };
    this.logger.error(
      `[${request.method}][${request.originalUrl}][${status}]${JSON.stringify(res)}`, //
      '响应',
    );

    response.status(status).json(res);
  }
}
