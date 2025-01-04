import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as requestIp from 'request-ip';
import * as iconvLite from 'iconv-lite';
import { AxiosInstance } from 'axios';
import { CustomLogger } from '@/common/logger/logger.module';
import { IPLocateType } from '@/common/type/response.interface';
import { UserService } from '@/user/user.service';
import { AuthedRequest } from '@/auth/types/auth-request.type';

// 登录审计
@Injectable()
export class LoginAuditInterceptor implements NestInterceptor {
  @Inject('Axios')
  private readonly axios: AxiosInstance;

  @Inject()
  private readonly Logger: CustomLogger;

  @Inject()
  private readonly userService: UserService;

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const host = context.switchToHttp();
    const request: AuthedRequest = host.getRequest();

    // 获取 IP 字段，如果用户使用代理这个字段展示的是代理服务器的 IP， 一般代理服务器会把真实 IP 放在 request.headers['X-Forwarded-For']。可以使用request-ip这个库(https://www.npmjs.com/package/request-ip)
    // IPv6 是冒分十六进制，IPv4是点分十进制。
    // 为了实现 IPv6、IPv4 互通，目前常常会将两者结合起来，以提高兼容性。例如： X:X:X:X:X:X:d.d.d.d
    // 注意：ffff:192.168.1.1, 其实是省略了IPv6的高位 0000:0000:0000:0000:0000

    // 如果希望通过 IP 获取城市，可以通过免费接口https://whois.pconline.com.cn/ipJson.jsp?ip=${IP}&json=true

    const IP = requestIp.getClientIp(request as any);

    const res = await this.axios(
      `https://whois.pconline.com.cn/ipJson.jsp?ip=${IP}&json=true`,
      {
        responseType: 'arraybuffer',
        transformResponse: [
          (data) => {
            const addrStr = iconvLite.decode(data, 'gbk'); // 需要转下编码
            return JSON.parse(addrStr);
          },
        ],
      },
    );

    const ipLocalInfo: IPLocateType = res.data ?? {};

    this.Logger.log(
      `登录成功 ${JSON.stringify(ipLocalInfo)}`,
      LoginAuditInterceptor.name,
    );

    this.userService.updateUserLastLoginData(request.user.userId, {
      lastLoginIP: ipLocalInfo.ip,
      lastLoginAddr: ipLocalInfo.addr,
      lastLoginTime: new Date(),
    });

    return next.handle();
  }
}
