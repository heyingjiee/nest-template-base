import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleAuthService } from '@/auth/role-auth/role-auth.service';

// 注意角色鉴权需要先验证JWT，所以不加@IsPublic()装饰器跳过JWT验证
@ApiTags('auth/permission')
@Controller('auth/permission')
export class PermissionController {
  @Inject()
  private roleAuthService: RoleAuthService;

  // 权限
  // @ApiOperation({ summary: '新建权限' })
  // @Post('create')
  // async createPermission() {}
  // @ApiOperation({ summary: '删除权限' })
  // @Get('delete')
  // deletePermission() {}
  @ApiOperation({ summary: '将权限分配给角色' })
  @Get('grant-permission')
  addPermissionToRole() {}
  @ApiOperation({ summary: '移除角色指定权限' })
  @Get('remove-permission')
  deletePermissionToRole() {}
}
