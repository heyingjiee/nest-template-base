import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { responseSuccess } from '../../utils/responseUtil';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../../common/configs/config';
import { IsPublic } from '../decorator/is-public.decorator';
import { AuthedRequest } from '../types/auth-request.type';
import { LocalRegisterUserDto } from './dto/register-user.dto';
import { LocalLoginUserDto } from './dto/login-user.dto';
import { LocalAuthService } from './local-auth.service';

@ApiTags('auth/local')
@IsPublic()
@Controller('auth/local')
export class LocalAuthController {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly localAuthService: LocalAuthService;

  constructor() {}

  @ApiOperation({ summary: '账号密码登录' })
  @ApiBody({ type: LocalLoginUserDto })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginByLocal(@Req() req: AuthedRequest) {
    const { userId, username } = req.user;
    const token = await this.jwtService.signAsync(
      {
        userId,
        username,
      },
      { expiresIn: appConfig.JWTConfig.expire },
    );

    return responseSuccess({
      token,
    });
  }

  @ApiOperation({ summary: '注册接口', description: '用于用户注册' })
  @ApiBody({ type: LocalRegisterUserDto })
  @IsPublic()
  @Post('register')
  async register(
    @Body(ValidationPipe) localRegisterUserDto: LocalRegisterUserDto,
  ) {
    await this.localAuthService.register(localRegisterUserDto);
    return responseSuccess(null, '注册成功');
  }
}
