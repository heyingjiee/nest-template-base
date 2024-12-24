import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CustomLogger } from '@/common/logger/logger.module';
import { aesEncrypt } from '@/utils/cryptoUtil';
import appConfig from '@/common/configs/config';
import * as process from 'node:process';
import {
  CheckSignFailException,
  TimeOverdueException,
} from '@/common/exception/common.exception';

@Injectable()
export class CheckSignGuard implements CanActivate {
  @Inject()
  private readonly logger: CustomLogger;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (process.env.NODE_ENV === 'dev') {
      // dev环境直接跳过
      return true;
    }

    // query、body 参数的 key按升序排列
    const mergeObject = {
      ...request.query,
      body: {
        ...request.body,
      },
    };

    const signResultList = [];

    // 参数加入签名
    for (const key of Object.keys(mergeObject).sort()) {
      if (key === 'body') {
        let bodySign = '';
        for (const bodyKey of Object.keys(mergeObject['body']).sort()) {
          bodySign += `${bodyKey}=${mergeObject['body'][bodyKey]}`;
        }
        signResultList.push(`body=${bodySign}`);
      } else {
        signResultList.push(`${key}=${mergeObject[key]}`);
      }
    }

    const timestamp = parseInt(request.headers['x-timestamp'] as string);

    // 时间戳加入签名
    signResultList.push(`timestamp=${timestamp}`);

    // 服务端计算签名
    const encryptServerSign = aesEncrypt(
      signResultList.join('&'),
      appConfig.signConfig.key,
    );

    // 验证签名
    if (request.headers['x-sign'] !== encryptServerSign) {
      throw new CheckSignFailException();
    }

    // 验证请求是否过期
    if (Date.now() - timestamp > 60 * 1000) {
      throw new TimeOverdueException();
    }

    return true;
  }
}
