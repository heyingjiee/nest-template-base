import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { responseSuccess } from '../utils/responseUtil';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../common/configs/config';
import { IsPublic } from './decorator/is-public.decorator';
import {
  AuthedRequest,
  GithubUserPassport,
  UserPassport,
} from './types/auth-request.type';
import {
  GithubRegisterUserDto,
  LocalRegisterUserDto,
} from './dto/register-user.dto';
import { LocalLoginUserDto } from './dto/login-user.dto';
import { LocalAuthService } from './service/local-auth.service';
import { GithubAuthService } from './service/github-auth.service';

@ApiTags('auth')
@IsPublic()
@Controller('auth')
export class AuthController {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly localAuthService: LocalAuthService;

  @Inject()
  private readonly githubAuthService: GithubAuthService;
  constructor() {}

  @ApiOperation({ summary: '账号密码登录' })
  @ApiBody({ type: LocalLoginUserDto })
  @UseGuards(AuthGuard('local'))
  @Post('local-login')
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
  @Post('local-register')
  async register(
    @Body(ValidationPipe) localRegisterUserDto: LocalRegisterUserDto,
  ) {
    await this.localAuthService.register(localRegisterUserDto);
    return responseSuccess(null, '注册成功');
  }

  @ApiOperation({
    summary: '请求Github授权',
    description: '页面重定向到Github授权页面',
  })
  @UseGuards(AuthGuard('github'))
  @Get('fetch-github-auth')
  async fetchGithubAuth() {}

  @ApiOperation({
    summary: 'Github登录',
    description:
      '授权成功后页面重定向到github后台配置的地址（url并携带参数code），AuthGuard通过code拿到github用户信息',
  })
  @ApiParam({
    name: 'code',
    type: String,
  })
  @UseGuards(AuthGuard('github'))
  @Get('github-login')
  async loginByGithub(
    @Req() req: AuthedRequest<GithubUserPassport | UserPassport>,
  ) {
    if ('userId' in req.user) {
      // 校验通过，下发jwt
      const { userId, username } = req.user;
      const token = await this.jwtService.signAsync(
        {
          userId,
          username,
        },
        { expiresIn: appConfig.JWTConfig.expire },
      );

      return responseSuccess({ token });
    } else {
      // 校验失败，自动创建用户，下发jwt
      const { profile } = req.user;
      // 用户不存在，则直接创建并绑定 （也可以将githubId返回前端，前端显示注册新用户，并在注册时提交githubId）
      const githubRegisterUserDto: GithubRegisterUserDto = {
        username: profile.displayName,
        githubId: profile.id,
      };
      await this.githubAuthService.register(githubRegisterUserDto);

      // return responseError({}, new Error('当前Github账户未绑定'));
    }
  }
}
