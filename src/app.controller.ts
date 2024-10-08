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
import { ApiOperation } from '@nestjs/swagger';
import Redis from 'ioredis';
import { ClsService } from 'nestjs-cls';

@Controller()
export class AppController {
  @Inject()
  private readonly logger: CustomLogger;

  @Inject('Axios')
  private readonly axios: AxiosInstance;

  @Inject()
  private readonly redis: Redis;

  @Inject()
  private readonly cls: ClsService;

  constructor(public readonly appService: AppService) {}

  @ApiOperation({
    summary: '实时日志',
    description: 'SSE实现实时日志推送',
  })
  @NoResponseLog() // 用装饰器阻止返回值写入日志。否则，接口响应后写入日志，写入日志再次触发handleSse，造成死循环
  @Sse('real-time-log')
  handleSSE() {
    const traceId = this.cls.getId();
    const today = dayjs().format('YYYY-MM-DD');
    const cmdStr = `tail -f ./${today}.log`;
    const childProcess = exec(cmdStr, { cwd: appConfig.logDir });
    return new Observable((observer) => {
      childProcess.stdout.on('data', (str) => {
        observer.next({ data: str });
      });

      // 在Observable被取消订阅时触发
      return () => {
        this.logger.log('客户端断开SSE连接', 'handleSSE', {
          traceId,
        });
      };
    });
  }

  @ApiOperation({
    summary: '请求样例',
    description: '应用axios发起三方请求',
  })
  @Get('axios-example')
  async handleAxiosExample() {
    //测试请求地址 https://httpbin.org/#/HTTP_Methods/get_get
    const res = await this.axios({
      url: 'https://httpbin.org/get',
    });
    // res.data是接口数据
    return responseSuccess(res.data);
  }
}
