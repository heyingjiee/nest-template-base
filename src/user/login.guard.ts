import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { isDefined } from 'class-validator';
import { Reflector } from '@nestjs/core';

declare module 'express' {
  interface Request {
    userId: number;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  jwtService: JwtService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const host = context.switchToHttp();
    const request: Request = host.getRequest();

    // getAllAndOverride 表示出现重复的元数据，后面的覆盖前面的
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(), // 获取class的元数据
      context.getHandler(), // 获取handler的元数据
    ]) as boolean | undefined;

    // 未设置登陆校验，放行
    if (!requireLogin) {
      return true;
    }

    const authorization = request.header('authorization'); // 取header字段，如果没有就是undefined

    if (!isDefined(authorization)) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      // verify返回会校验入参，错误就抛出了Error
      // token正确则返回的{...payload,iat:签发时间戳,exp:过期时间戳}
      const jwtData = this.jwtService.verify(authorization);
      // 挂到请求上，controller中可以使用
      request.userId = jwtData.userId;
    } catch (err) {
      throw new UnauthorizedException('token失效，请重新登录');
    }

    return true;
  }
}
