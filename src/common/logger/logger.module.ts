import {
  DynamicModule,
  Inject,
  Injectable,
  LoggerService,
  Module,
} from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import 'winston-daily-rotate-file';
import appConfig from '../configs/config';
import { ClsService } from 'nestjs-cls';

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

  private consoleTransport = new transports.Console({
    format: format.combine(
      format.printf((param) => {
        const { context, level, message, time, traceId } = param; // this.logger.xxx(msg,extra)传进来的extra参数
        const appStr = chalk.green(`[${appConfig.applicationName}]`); // 应用名
        const timeStr = chalk.magenta(`[${time}]`); // 时间
        const traceIdStr = chalk.cyan(`[${traceId}]`); // traceId
        const contextStr = chalk.yellow(`[${context}]`); // 上下文

        let levelStr = '';
        switch (level) {
          case 'info':
            levelStr = chalk.green(`[${level}]`);
            break;
          case 'warn':
            levelStr = chalk.yellow(`[${level}]`);
            break;
          case 'error':
            levelStr = chalk.red(`[${level}]`);
            break;
        }

        return `${appStr} ${timeStr} ${traceIdStr} ${levelStr} ${contextStr} ${message}`;
      }),
    ),
  });

  private dailyRotateFileTransport = new transports.DailyRotateFile({
    level: 'info',
    format: format.combine(format.json()),
    dirname: appConfig.logDir,
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD', // 设置文件名中的%DATE%的格式
    maxSize: '10M', // 当个日志文件大小
    maxFiles: '14d', // 文件保存天数
  });

  @Inject()
  private readonly cls: ClsService;

  constructor() {
    let transportList = [];
    if (process.env.NODE_ENV === 'dev') {
      transportList = [this.consoleTransport, this.dailyRotateFileTransport];
    } else {
      transportList = [this.dailyRotateFileTransport];
    }

    this.logger = createLogger({
      level: 'info',
      transports: transportList,
      exitOnError: false,
    });
  }

  log(message: any, context: string, meta?: Record<string, any>): any {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss.SSS');
    this.logger.log('info', `${message}`, {
      traceId: this.cls.getId() ?? '-',
      context,
      time,
      ...meta,
    });
  }
  warn(message: any, context: string, meta?: Record<string, any>): any {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss.SSS');
    this.logger.log('warn', `${message}`, {
      traceId: this.cls.getId() ?? '-',
      context,
      time,
      ...meta,
    });
  }
  error(message: any, context: string, meta?: Record<string, any>): any {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss.SSS');
    this.logger.log('error', `${message}`, {
      traceId: this.cls.getId() ?? '-',
      context,
      time,
      ...meta,
    });
  }
}
