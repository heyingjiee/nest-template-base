import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Req,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { responseSuccess } from '../utils/responseUtil';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../auth/decorator/require-permission.decorator';
import { ClsService } from 'nestjs-cls';
import { JwtAuthExceptionFilter } from '../auth/filter/jwt-auth-exception.filter';
import { AuthedRequest } from '../auth/types/auth-request.type';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject()
  private readonly cls: ClsService;

  // @Get('init')
  // async initUserPermissionData() {
  //   await this.userService.initData();
  //   return responseSuccess(null);
  // }

  @ApiOperation({
    summary: '测试接口',
    description: 'RequirePermission 设置接口权限',
  })
  @RequirePermission('add')
  @UseFilters(JwtAuthExceptionFilter)
  @Get('test')
  handlerAAA() {
    return responseSuccess(null);
  }

  @ApiOperation({
    summary: '用户信息',
    description: '查询用户自己的非隐私信息',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  async handleUserInfo(@Req() req: AuthedRequest) {
    return responseSuccess(
      await this.userService.findRolesByUserId(req.user.userId),
    );
  }
}
