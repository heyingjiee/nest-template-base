import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './common/logger/logger.module';
import appConfig from './common/configs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SocketModule } from './socket/socket.module';
import { RedisModule } from './common/modules/redis.module';
import { EmailModule } from './email/email.module';
import { AxiosModule } from './common/modules/axios.module';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { FileOperateModule } from './file-operate/file-operate.module';
import { AccessLogMiddleware } from './common/middleware/access-log.middleware';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';
import { GlobalResponseInterceptor } from './common/interceptor/global-response.interceptor';
import { AuthModule } from './auth/auth.module';
import { JwtVerifyGuard } from './auth/jwt-auth/jwt-verify.guard';
import { JwtAuthExceptionFilter } from './auth/jwt-auth/jwt-auth-exception.filter';
import { RolePermissionVerifyGuard } from '@/auth/role-auth/role-permission-verify.guard';

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
      secret: appConfig.JWTConfig.secret, // 秘钥
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
        mount: false, // true自动应用在全部路由上，false需要在consumer.apply中手动设置路由
        // setup: (cls,req) => {
        //// 每个请求有独立的作用域，同一个请求上下文共享数据。我们可以出于共享上下文的目的添加想要的数据。业务汇总注入 cls，通过this.cls.get('xxx') 取出来
        //   cls.set('userId', req.headers['x-user-id']);
        //   cls.set('traceId', uuid.v4()); // 引入 import * as uuid from 'uuid';
        // },
        generateId: true,
        // idGenerator: () =>  uuid.v4(), // 可以定义生成的id。例如使用uuid这个包的uuidv4()
      },
    }),
    UserModule,
    SchedulerModule,
    SocketModule,
    EmailModule,
    FileOperateModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局JWT校验路由守卫，默认全部开启，使用@isPublic可跳过该守卫
    {
      provide: 'APP_GUARD',
      useClass: JwtVerifyGuard,
    },
    // 全局角色权限守卫，只对@RequirePermission()开启
    {
      provide: 'APP_GUARD',
      useClass: RolePermissionVerifyGuard,
    },
    // 错误过滤器
    {
      provide: 'APP_FILTER',
      useClass: JwtAuthExceptionFilter,
    },
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
    // 拦截器
    {
      provide: 'APP_INTERCEPTOR',
      useClass: GlobalResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 链路追踪生成 traceId，一定得是第一个中间件
    consumer.apply(ClsMiddleware, AccessLogMiddleware).forRoutes('*');
  }
}
