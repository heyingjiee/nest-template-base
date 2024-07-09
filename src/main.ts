import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { CustomLogger } from './common/logger/logger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 所有的日志都会被放入缓冲区直到一个自定义的日志记录器被接入
  });

  app.useLogger(app.get(CustomLogger)); // 接入日志记录器

  app.use(cors());

  // Swagger 接口文档
  const config = new DocumentBuilder()
    .setTitle('Nest-Example项目')
    .setDescription('Nest-Example接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document); // 第一个参数是path， swagger文档地址 http://localhost:3000/${path}

  await app.listen(3002);
}
bootstrap();
