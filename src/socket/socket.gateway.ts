import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';
import { CustomLogger } from '../common/logger/logger.module';

// 声明处理 websocket 的类。websocket服务的地址、端口与项目一致
@WebSocketGateway()
export class SocketGateway {
  @Inject()
  private readonly logger: CustomLogger;
  constructor(private readonly socketService: SocketService) {}

  // websocket接口地址
  @SubscribeMessage('socketTest1')
  findAll() {
    return new Observable((observer) => {
      observer.next('socketTest1 返回数据 第1次');

      setTimeout(() => {
        observer.next('socketTest1 返回数据 第2次');
      }, 2000);

      return () => {
        this.logger.log('客户端断开连接', 'WebSocketGateway');
      };
    });
  }

  @SubscribeMessage('socketTest2')
  findOne(@MessageBody() id: number) {
    // @MessageBody() 获取参数
    return 'socketTest2 返回数据 id：' + id;
  }

  @SubscribeMessage('socketTest3')
  update(@MessageBody() updateSocketDto: UpdateSocketDto) {
    return 'socketTest3 返回数据:' + JSON.stringify(updateSocketDto);
  }
}
