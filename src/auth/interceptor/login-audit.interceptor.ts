import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as requestIp from 'request-ip';
import * as iconvLite from 'iconv-lite';
import { AxiosInstance } from 'axios';
import { CustomLogger } from '@/common/logger/logger.module';
import { IPLocateType } from '@/common/type/response.interface';

@Injectable()
export class LoginAuditInterceptor implements NestInterceptor {
  @Inject('Axios')
  private readonly axios: AxiosInstance;

  @Inject()
  private readonly Logger: CustomLogger;

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const host = context.switchToHttp();
    const request: Request = host.getRequest();

    // 获取 IP 字段，如果用户使用代理这个字段展示的是代理服务器的 IP， 一般代理服务器会把真实 IP 放在 request.headers['X-Forwarded-For']。可以使用request-ip这个库(https://www.npmjs.com/package/request-ip)
    // IPv6 是冒分十六进制，IPv4是点分十进制。
    // 为了实现 IPv6、IPv4 互通，目前常常会将两者结合起来，以提高兼容性。例如： X:X:X:X:X:X:d.d.d.d
    // 注意：ffff:192.168.1.1, 其实是省略了IPv6的高位 0000:0000:0000:0000:0000

    // 如果希望通过 IP 获取城市，可以通过免费接口https://whois.pconline.com.cn/ipJson.jsp?ip=${IP}&json=true

    const IP = requestIp.getClientIp(request);

    const res = await this.axios(
      `https://whois.pconline.com.cn/ipJson.jsp?ip=${IP}&json=true`,
      {
        responseType: 'arraybuffer',
        transformResponse: [
          (data) => {
            const addrStr = iconvLite.decode(data, 'gbk');
            return JSON.parse(addrStr);
          },
        ],
      },
    );

    const ipLocalInfo: IPLocateType = res.data ?? {};

    this.Logger.log(
      `登录成功拦截器 ${JSON.stringify(ipLocalInfo)}`,
      LoginAuditInterceptor.name,
    );

    return next.handle();
  }
}
