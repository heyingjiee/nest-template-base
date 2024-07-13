import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { responseSuccess } from '../utils/responseUtil';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from '../common/decorator/require-login.decorator';
import { RequirePermission } from '../common/decorator/require-permission.decorator';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  // @Get('init')
  // async initUserPermissionData() {
  //   await this.userService.initData();
  //   return responseSuccess(null);
  // }

  @ApiOperation({
    summary: '测试接口',
    description:
      '装饰器 RequireLogin 设置接口需登录、RequirePermission 设置接口权限',
  })
  @RequireLogin()
  @RequirePermission('add')
  @Get('test')
  handlerAAA() {
    return responseSuccess(null);
  }

  @ApiOperation({ summary: '登录接口', description: '用于用户登录' })
  @ApiBody({ type: LoginUserDto })
  // 添加返回值用例
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功返回值',
    type: null,
  })
  @Post('login')
  async login(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userService.login(loginUserDto);
    const token = await this.jwtService.signAsync(
      {
        userId: foundUser.id,
        username: foundUser.username,
      },
      { expiresIn: '7d' },
    );

    res.setHeader('token', token);

    return responseSuccess(null);
  }

  @ApiOperation({ summary: '注册接口', description: '用于用户注册' })
  @ApiBody({ type: RegisterUserDto })
  @Post('register')
  async register(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    await this.userService.register(registerUserDto);
    return responseSuccess(null, '注册成功');
  }

  @ApiOperation({
    summary: '用户信息',
    description: '查询用户自己的非隐私信息',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @RequireLogin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  async handleUserInfo(@Req() req: Request) {
    // @RequireLogin() 校验通过的，request上都携带了userId
    return responseSuccess(
      await this.userService.findRolesByUserId(req.userId),
    );
  }
}
