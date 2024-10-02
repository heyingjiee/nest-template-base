import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { responseSuccess } from '../../utils/responseUtil';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../../common/configs/config';
import { IsPublic } from '../decorator/is-public.decorator';
import {
  AuthedRequest,
  GithubUserPassport,
  UserPassport,
} from '../types/auth-request.type';
import { GithubRegisterUserDto } from './dto/register-user.dto';
import { GithubAuthService } from './github-auth.service';
import { GithubVerifyGuard } from '@/auth/github-auth/github-verify.guard';

@ApiTags('auth/github')
@IsPublic()
@Controller('auth/github')
export class GithubAuthController {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly githubAuthService: GithubAuthService;
  constructor() {}

  @ApiOperation({
    summary: '请求Github授权',
    description: '页面重定向到Github授权页面',
  })
  @UseGuards(GithubVerifyGuard)
  @Get('fetch-auth')
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
  @UseGuards(GithubVerifyGuard)
  @Get('login')
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
