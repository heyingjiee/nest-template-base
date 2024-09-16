import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// 注意角色全局验证需要先验证JWT，所以不加@IsPublic()装饰器跳过JWT验证
@ApiTags('auth/role')
@Controller('auth/role')
export class RoleAuthController {
  @ApiOperation({ summary: '新建角色' })
  @Get('create')
  createRole() {}
  @ApiOperation({ summary: '删除角色' })
  @Get('delete')
  deleteRole() {}

  @ApiOperation({ summary: '查询角色权限' })
  @Get('query')
  queryRole() {}

  @ApiOperation({ summary: '增加指定角色权限' })
  @Get('add-permission')
  addPermissionToUser() {}

  @ApiOperation({ summary: '移除指定角色权限' })
  @Get('delete-permission')
  deletePermissionToUser() {}

  @ApiOperation({ summary: '分配角色给用户' })
  @Get('assign-role')
  setRoleToUser() {}
}
