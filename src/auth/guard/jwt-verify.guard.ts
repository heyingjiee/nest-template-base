import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CustomLogger } from '../../common/logger/logger.module';

@Injectable()
export class JwtVerifyGuard extends AuthGuard('jwt') {
  @Inject()
  jwtService: JwtService;

  @Inject()
  private readonly reflector: Reflector;

  @Inject()
  private readonly logger: CustomLogger;

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
}
