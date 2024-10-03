import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleAuthService } from '@/auth/role-auth/role-auth.service';
import { CreateRoleDto } from '@/auth/role-auth/dto/role.dto';
import { responseSuccess } from '@/utils/responseUtil';
import { ParamVerifyFailException } from '@/common/exception/common.exception';
import { ResponseType } from '@/common/type/response.interface';
import { Role } from '@/auth/role-auth/entities/role.entity';

// 注意角色鉴权需要先验证JWT，所以不加@IsPublic()装饰器跳过JWT验证
@ApiTags('auth/role')
@Controller('auth/role')
export class RoleController {
  @Inject()
  private roleAuthService: RoleAuthService;

  @ApiOperation({ summary: '新建角色' })
  @Post('create')
  async createRole(@Body(ValidationPipe) createRoleDto: CreateRoleDto) {
    await this.roleAuthService.createRole(createRoleDto);
    return responseSuccess(null);
  }
  @ApiOperation({ summary: '删除角色' })
  @Get('delete')
  async deleteRole(
    @Query(
      'roleId',
      new ParseIntPipe({
        exceptionFactory: () => {
          return new ParamVerifyFailException();
        },
      }),
    )
    roleId: number,
  ) {
    await this.roleAuthService.deleteRoleById(roleId);
    return responseSuccess(null);
  }
  @ApiOperation({ summary: '查询全部角色' })
  @Get('')
  async queryAllRole() {
    const roleList = await this.roleAuthService.findAllRole();
    return responseSuccess(roleList);
  }

  @ApiOperation({ summary: '查询角色权限' })
  @ApiResponse({
    status: 200,
    type: Role,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('has-permission')
  async queryPermissionBelongToRole(
    @Query(
      'roleId',
      new ParseIntPipe({
        exceptionFactory: () => {
          return new ParamVerifyFailException();
        },
      }),
    )
    roleId: number,
  ) {
    const permissionList =
      await this.roleAuthService.findPermissionByRoleId(roleId);
    return responseSuccess(permissionList);
  }

  @ApiOperation({ summary: '分配角色给用户' })
  @Get('assign-role')
  setRoleToUser() {}
  @ApiOperation({ summary: '移除用户指定角色' })
  @Get('remove-role')
  deleteRoleToUser() {}
}
