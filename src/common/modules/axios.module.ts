import { DynamicModule, Module, Provider } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpModuleOptions } from '@nestjs/axios/dist/interfaces';
import { CustomLogger } from '../logger/logger.module';

interface AxiosModuleOption {
  global: boolean;
  axiosConfig: HttpModuleOptions;
}

@Module({})
export class AxiosModule {
  static forRoot(options: AxiosModuleOption): DynamicModule {
    const axiosProvider: Provider = {
      provide: 'axios',
      inject: [HttpService, CustomLogger],
      useFactory: (httpService: HttpService, logger: CustomLogger) => {
        // 请求拦截器
        httpService.axiosRef.interceptors.request.use(
          (config) => {
            logger.log(
              `[${config.method.toUpperCase()}][${config.url}]`,
              '外部请求',
            );
            return config;
          },
          (err) => {
            logger.error(`${JSON.stringify(err)}`, '外部请求');
            return Promise.reject(err);
          },
        );

        // 响应拦截器
        httpService.axiosRef.interceptors.response.use(
          (response) => {
            const { url, method } = response.config;
            logger.log(
              `[${method.toUpperCase()}][${url}][${response.status}]${JSON.stringify(response.data)}`,
              '外部响应',
            );
            return response;
          },
          (err) => {
            // 超出 2xx 范围的状态码都会触发该函数。
            // 对响应错误做点什么
            logger.error(`${JSON.stringify(err)}`, '外部响应');
            return Promise.reject(err);
          },
        );

        return httpService.axiosRef;
      },
    };

    return {
      imports: [HttpModule.register(options.axiosConfig)],
      module: AxiosModule,
      global: options.global,
      providers: [axiosProvider],
      exports: [axiosProvider],
    };
  }
}
