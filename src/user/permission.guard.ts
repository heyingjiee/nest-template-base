import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { isDefined } from 'class-validator';
import { UserService } from './user.service';
import { CustomLogger } from '../common/logger/logger.module';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly logger: CustomLogger;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const host = context.switchToHttp();

    const request: Request = host.getRequest();

    const requirePermission = this.reflector.getAllAndOverride(
      'require-permission',
      [context.getClass(), context.getHandler()],
    ) as string[] | undefined;

    // 未设置权限，直接放行
    if (!requirePermission) {
      return true;
    }

    // 设置权限
    // 获取当其用户权限
    if (!isDefined(request.userId)) {
      // 登录守卫会设置用户信息
      throw new UnauthorizedException(
        '设置权限需用户登陆，handler需增加@RequireLogin()',
      );
    }

    const userId = request.userId;
    const roles = (await this.userService.findRolesByUserId(userId))?.roles;

    if (roles.length === 0) {
      this.logger.log(`userId:${userId},未分配角色`, 'PermissionGuard');
      throw new UnauthorizedException('该用户暂未分配角色');
    }

    const rolesJoinPermissions =
      await this.userService.findPermissionsByRoleIds(
        roles.map((item) => item.id),
      );

    const permissionNameSet = new Set();
    rolesJoinPermissions.forEach((item) => {
      item.permissions.forEach((permission) => {
        permissionNameSet.add(permission.name);
      });
    });

    return requirePermission.every((requirePermissionName) => {
      return permissionNameSet.has(requirePermissionName);
    });
  }
}
