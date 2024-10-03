import { Controller, Inject } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { CustomLogger } from '../common/logger/logger.module';

@Controller('scheduler')
export class SchedulerController {
  @Inject()
  private readonly logger: CustomLogger;
  constructor(private readonly schedulerService: SchedulerService) {}
  // @Cron(CronExpression.EVERY_5_SECONDS, {
  //   name: 'task1',
  //   timeZone: 'Asia/shanghai',
  // })
  // handleCron() {
  //   this.logger.log('定时任务1', '定时任务');
  // }
  //
  // // 毫秒值
  // @Interval('task2', 5000)
  // handleInterval() {
  //   this.logger.log('定时任务2','定时任务');
  // }
  //
  // @Timeout('task3', 2000)
  // handleTimeout() {
  //   this.logger.log('定时任务3', '定时任务');
  // }
}
