import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { LocalLoginUserDto } from '../dto/login-user.dto';
import { LocalAuthService } from '../service/local-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly localService: LocalAuthService;
  constructor() {
    super({
      passReqToCallback: true, // 设置这个后。validate的第一个参数是request对象
    });
  }

  async validate(request: Request) {
    const { username, password } = request.body;

    const localLoginUserDto: LocalLoginUserDto = { username, password };

    const userInfo: User = await this.localService.login(localLoginUserDto);

    return { userId: userInfo.id, username: userInfo.username };
  }
}
