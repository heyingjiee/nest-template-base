import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './common/modules/redis.module';
import { LoginGuard } from './user/login.guard';
import { PermissionGuard } from './user/permission.guard';
import { CustomLogger, LoggerModule } from './common/logger/logger.module';
import appConfig from './common/configs/config';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: appConfig.staticAssetDir,
      serveRoot: '/static', // http://127.0.0.1:3000/static/socket.html 就能访问到 src/public下的文件了
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(appConfig.ormConfig),
    RedisModule.forRoot({
      global: true,
      redisConfig: appConfig.redisConfig,
    }),
    LoggerModule.forRoot({ global: true }),
    JwtModule.register({
      global: true, // 设置为全局模块，使用无需import，全局都可以注入
      secret: 'hedaodao', // 秘钥
    }),
    SchedulerModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 路由守卫
    {
      provide: 'APP_GUARD',
      useClass: LoginGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: PermissionGuard,
    },
    // 错误拦截
    {
      provide: 'APP_FILTER',
      useClass: ExceptionFilter,
    },
    // 拦截器
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  private readonly schedulerRegistry: SchedulerRegistry;

  @Inject()
  private readonly logger: CustomLogger;

  onApplicationBootstrap(): any {}
}
