import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { CustomLogger } from '../modules/logger.module';
import { Request, Response } from 'express';

interface Data<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  @Inject(CustomLogger)
  private readonly logger: CustomLogger;

  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    const host = context.switchToHttp();
    const request: Request = host.getRequest();
    const response: Response = host.getResponse();

    const { method, path } = request;

    this.logger.log(`[${path}][${method}]`, '请求');
    return next.handle().pipe(
      tap((res) => {
        this.logger.log(
          `[${path}][${method}][${response.statusCode}]${JSON.stringify(res)}`,
          '响应',
        );
      }),
      map((data) => {
        return data;
      }),
    );
  }
}
