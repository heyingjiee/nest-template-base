import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { responseSuccess } from '../utils/responseUtil';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  // @RequireLogin()
  // @RequirePermission('add')
  @Get('aaa')
  handlerAAA() {
    return responseSuccess(null);
  }

  // 接口概述
  @ApiOperation({
    summary: '登录接口',
    description: '用于用户登录',
  })
  @ApiBody({
    type: LoginUserDto,
  })

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
    const accessToken = await this.jwtService.signAsync(
      {
        userId: foundUser.id,
        username: foundUser.username,
      },
      { expiresIn: '30m' },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: foundUser.id,
        username: foundUser.username,
      },
      { expiresIn: '7d' },
    );

    res.setHeader('access_token', accessToken);
    res.setHeader('refresh_token', refreshToken);

    return responseSuccess(null);
  }

  @Post('register')
  async register(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    await this.userService.register(registerUserDto);
    return responseSuccess(null, '注册成功');
  }
}
