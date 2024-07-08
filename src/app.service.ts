import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  @Inject('REDIS')
  private readonly redis: Redis;

  async getHello() {
    return 'hello';
  }
}
