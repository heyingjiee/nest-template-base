import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import appConfig from '../../common/configs/config';
const fromHeader = ExtractJwt.fromHeader;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: fromHeader('token'), // 如果使用 ExtractJwt.fromAuthHeaderAsBearerToken() ，则是提取请求头中的 Authorization:Bearer xxxx
      ignoreExpiration: false,
      secretOrKey: appConfig.JWTConfig.secret,
    });
  }

  validate(payload: any) {
    debugger;
    return { userId: payload.userId, username: payload.username };
  }
}
