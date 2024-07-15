import { Controller, Get, Inject, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { exec } from 'child_process';
import * as dayjs from 'dayjs';
import { CustomLogger } from './common/logger/logger.module';
import appConfig from './common/configs/config';
import { NoResponseLog } from './common/decorator/no-response-log.decorator';
import { AxiosInstance } from 'axios';
import { responseSuccess } from './utils/responseUtil';

@Controller()
export class AppController {
  @Inject()
  private readonly logger: CustomLogger;

  @Inject('axios')
  private readonly axios: AxiosInstance;
  constructor(public readonly appService: AppService) {}

  @NoResponseLog() // 用装饰器阻止返回值写入日志。否则，接口响应后写入日志，写入日志再次触发handleSse，造成死循环
  @Sse('real-time-log')
  handleSse() {
    const today = dayjs().format('YYYY-MM-DD');
    const cmdStr = `tail -f ./${today}.log`;
    const childProcess = exec(cmdStr, { cwd: appConfig.logDir });
    return new Observable((observer) => {
      childProcess.stdout.on('data', (str) => {
        observer.next({ data: str });
      });

      // 在Observable被取消订阅时触发
      return () => {
        console.log('客户端断开SSE连接');
      };
    });
  }

  @Get('axios-example')
  async handleAxiosExample() {
    // https://httpbin.org/#/HTTP_Methods/get_get
    const res = await this.axios({
      url: 'https://httpbin.org/get',
    });
    // res.data是接口数据
    return responseSuccess(res.data);
  }
}
