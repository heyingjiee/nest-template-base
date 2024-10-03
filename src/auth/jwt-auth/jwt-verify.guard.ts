import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedAuthException } from '@/common/exception/auth.exception';
import { CustomLogger } from '@/common/logger/logger.module';

@Injectable()
export class JwtVerifyGuard extends AuthGuard('jwt') {
  @Inject()
  jwtService: JwtService;

  @Inject()
  private readonly reflector: Reflector;

  @Inject()
  private readonly Logger: CustomLogger;

  // 命中守卫，就会执行canActivate。返回 true 就会继续执行
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // getAllAndOverride 表示出现重复的元数据，后面的覆盖前面的
    const isPublic = this.reflector.getAllAndOverride('is-public', [
      context.getClass(), // 获取class的元数据
      context.getHandler(), // 获取handler的元数据
    ]) as boolean | undefined;

    // 无需登录接口，直接放行
    if (isPublic) {
      return true;
    }

    // 需要登陆，则调用AuthGuard('jwt')
    return super.canActivate(context);
  }

  // 验证逻辑处理后会调用到这里。因为默认抛出的错误message 是英文，所以这里重写下抛出错误逻辑
  handleRequest(err: any, user: any, info: any) {
    // 参数：err 错误对象（没有就是 null）, user 用户信息（没有就是 null）, info 验证信息（失败就是自定义的 Error）, context: ExecutionContext
    this.Logger.log(
      `err:${err} | user:${user} | info:${JSON.stringify(info)}`,
      JwtVerifyGuard.name,
    );
    // 自定义错误处理逻辑
    if (err || !user) {
      // 这里可以根据err或info的内容来定制化错误信息
      throw new UnauthorizedAuthException();
    }
    return user;
  }
}
