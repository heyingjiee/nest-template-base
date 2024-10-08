import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomLogger } from '@/common/logger/logger.module';
import { AuthedRequest } from '../types/auth-request.type';
import { Request } from 'express';
import { RoleAuthService } from './role-auth.service';
import { UnauthorizedAuthException } from '@/common/exception/auth.exception';

@Injectable()
export class RolePermissionVerifyGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  @Inject()
  private readonly roleAuthService: RoleAuthService;

  @Inject()
  private readonly logger: CustomLogger;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const host = context.switchToHttp();

    const request: AuthedRequest | Request = host.getRequest();

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
    if (!('userId' in request.user)) {
      // 登录守卫会设置用户信息
      throw new UnauthorizedAuthException({
        message: '设置权限需用户登陆，handler需增加@RequireLogin()',
      });
    }

    const userId = request.user.userId;
    const roles = (await this.roleAuthService.findRolesByUserId(userId))?.roles;

    if (roles.length === 0) {
      this.logger.log(`userId:${userId},未分配角色`, 'PermissionGuard');
      throw new UnauthorizedAuthException({ message: '该用户暂未分配角色' });
    }

    const rolesJoinPermissions =
      await this.roleAuthService.findPermissionsByRoleIds(
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
