import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import appConfig from '../../common/configs/config';
import fromAuthHeaderAsBearerToken = ExtractJwt.fromAuthHeaderAsBearerToken;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: fromAuthHeaderAsBearerToken(), // 请求头 Authorization:Bearer xxxx
      ignoreExpiration: false,
      secretOrKey: appConfig.JWTConfig.secret,
    });
  }

  validate(payload: any) {
    return { userId: payload.userId, username: payload.username };
  }
}
