import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from './user/login.guard';
import { PermissionGuard } from './user/permission.guard';
import { LoggerModule } from './common/logger/logger.module';
import appConfig from './common/configs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SocketModule } from './socket/socket.module';
import { RedisModule } from './common/modules/redis.module';
import { EmailModule } from './email/email.module';
import { AxiosModule } from './common/modules/axios.module';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    LoggerModule.forRoot({ global: true }),
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
    JwtModule.register({
      global: true, // 设置为全局模块，使用无需import，全局都可以注入
      secret: 'hedaodao', // 秘钥
    }),
    AxiosModule.forRoot({
      global: true,
      axiosConfig: {
        timeout: 5000,
        maxRedirects: 5,
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true, // 为全部路由增加中间件
        setup: (cls) => {
          // cls.set('userId', req.headers['x-user-id']); // 每个请求有独立的作用域，同一个请求上下文共享数据
          cls.set('traceId', uuidv4());
        },
        // generateId: true,
        // idGenerator: () => uuidv4(),
      },
    }),
    UserModule,
    SchedulerModule,
    SocketModule,
    EmailModule,
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
  onApplicationBootstrap(): any {}
}
