import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { UserService } from '../../user/user.service';
import { CustomLogger } from '../../common/logger/logger.module';
import { GithubUserPassport, UserPassport } from '../types/auth-request.type';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  @Inject()
  userService: UserService;

  @Inject()
  logger: CustomLogger;
  constructor() {
    super({
      clientID: 'Ov23lidkuhTCj7GcX4Xc',
      clientSecret: '24dcd69755dbc318ec5d74ed1dabd87a84a9187c',
      callbackURL: 'http://localhost:3000/auth/callback', // 这里
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
      const user = await this.userService.findRolesByGithubId(profile.id);
      if (user) {
        // 存在该用户
        return { userId: user.id, username: user.username };
      } else {
        // 不存在该用户
        return { profile };
      }
    }

    throw new UnauthorizedException('githubId获取失败');
  }
}
