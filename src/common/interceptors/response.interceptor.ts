import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { CustomLogger } from '../logger/logger.module';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

interface Data<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  @Inject()
  private readonly logger: CustomLogger;

  @Inject()
  private readonly reflector: Reflector;

  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    const host = context.switchToHttp();
    const request: Request = host.getRequest();
    const response: Response = host.getResponse();

    const noResponseLog = this.reflector.getAllAndOverride('no-response-log', [
      context.getClass(), // 获取class的元数据
      context.getHandler(), // 获取handler的元数据
    ]) as boolean | undefined;

    const { method, path } = request;

    this.logger.log(`[${method}][${path}]`, '请求');
    return next.handle().pipe(
      tap((res) => {
        if (!noResponseLog) {
          this.logger.log(
            `[${method}][${path}][${response.statusCode}]${JSON.stringify(res)}`,
            '响应',
          );
        }
      }),
      map((data) => {
        return data;
      }),
    );
  }
}
