import {
  DynamicModule,
  Injectable,
  LoggerService,
  Module,
} from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import 'winston-daily-rotate-file';

interface loggerOption {
  global: boolean;
}

@Module({})
export class LoggerModule {
  static forRoot(options: loggerOption): DynamicModule {
    return {
      module: LoggerModule,
      global: options.global,
      providers: [CustomLogger],
      exports: [CustomLogger],
    };
  }
}

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      transports: [
        new transports.Console({
          format: format.combine(
            format.printf((param) => {
              const { context, level, message, time } = param;
              const appStr = chalk.green('[Nest]');
              const contextStr = chalk.yellow(`[${context}]`);
              const levelStr =
                level === 'info'
                  ? chalk.green(`[${level}]`)
                  : chalk.red(`[${level}]`);
              return `${appStr} [${time}] ${levelStr} ${contextStr} ${message}`;
            }),
          ),
        }),
        new transports.DailyRotateFile({
          level: 'info',
          format: format.combine(format.json()),
          dirname: 'logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD', // 设置文件名中的%DATE%的格式
          maxSize: '10M', // 当个日志文件大小
          maxFiles: '14d', // 文件保存天数
        }),
      ],
      // 所有未捕获的异常都将被记录到 'error.log' 文件中
      exceptionHandlers: [
        new transports.File({
          dirname: 'logs',
          filename: 'global-error.log',
        }),
      ],
      // 所有未处理的 Promise 拒绝都将被记录到 'rejections.log' 文件中
      rejectionHandlers: [
        new transports.File({
          dirname: 'logs',
          filename: 'global-error.log',
        }),
      ],
      // 默认值是 true，表示在记录未捕获的异常后退出进程
      exitOnError: true,
    });
  }

  log(message: any, ...optionalParams: any[]): any {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', `${message}`, { context: optionalParams[0], time });
  }
  warn(message: any, ...optionalParams: any[]): any {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('warn', `${message}`, { context: optionalParams[0], time });
  }
  error(message: any, ...optionalParams: any[]): any {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('error', `${message}`, {
      context: optionalParams[0],
      time,
    });
  }
}
