import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { CustomLogger } from './common/logger/logger.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'node:process';
import appConfig from '@/common/configs/config';

async function bootstrap() {
  // 如何需要支持Https，可以在这里配置证书
  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/private-key.pem'),
  //   cert: fs.readFileSync('./secrets/public-certificate.pem'),
  // };
  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions,
  // });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true, // 所有的日志都会被放入缓冲区直到一个自定义的日志记录器被接入
  });

  app.useLogger(app.get(CustomLogger)); // 接入日志记录器

  // 启用跨域
  app.enableCors();

  // Swagger 接口文档
  if (process.env.NODE_ENV !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle('Nest-Example项目')
      .setDescription('Nest-Example接口文档')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document); // 第一个参数是path， swagger文档地址 http://localhost:3000/${path}
  }
  await app.listen(appConfig.port);
}
bootstrap();
