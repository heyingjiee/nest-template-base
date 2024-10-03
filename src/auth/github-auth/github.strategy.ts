import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { CustomLogger } from '../../common/logger/logger.module';
import { GithubUserPassport, UserPassport } from '../types/auth-request.type';
import { RoleAuthService } from '@/auth/role-auth/role-auth.service';
import { UnauthorizedAuthException } from '@/common/exception/auth.exception';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  @Inject()
  roleAuthService: RoleAuthService;

  @Inject()
  logger: CustomLogger;
  constructor() {
    // 下面这些配置信息，都是重定向到Github授权页携带的参数
    super({
      clientID: 'Ov23lidkuhTCj7GcX4Xc',
      clientSecret: '24dcd69755dbc318ec5d74ed1dabd87a84a9187c',
      callbackURL: 'http://localhost:3000/auth/github-login', // 这里回调地址就是github后台配置的回调地址。在Github授权页中授权成功后，会回跳这个地址，一般是前端项目的页面
      scope: ['public_profile'], // scope 是请求的信息
    });
  }

  // Github重定向，在url上加了code参数。passport-github2通过code获取信息，传入validate
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<GithubUserPassport | UserPassport> {
    // profile包含Github用户信息，例如 id, 昵称：displayName、用户名：username、邮箱：emails[0].value、头像：photos[0].value
    this.logger.log(JSON.stringify(profile), 'github-strategy userProfile');
    if (profile.id) {
      const user = await this.roleAuthService.findRolesByGithubId(profile.id);
      if (user) {
        // 存在该用户
        return { userId: user.id, username: user.username };
      } else {
        // 不存在该用户
        return { profile };
      }
    }

    throw new UnauthorizedAuthException({ message: 'githubId获取失败' });
  }
}
