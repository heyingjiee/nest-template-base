import { Module } from '@nestjs/common';
import { LocalStrategy } from './local-auth/local.strategy';
import { JwtStrategy } from './jwt-auth/jwt.startegy';
import { GithubStrategy } from './github-auth/github.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { LocalAuthService } from './local-auth/local-auth.service';
import { GithubAuthService } from './github-auth/github-auth.service';
import { LocalAuthController } from './local-auth/local-auth.controller';
import { GithubAuthController } from './github-auth/github-auth.controller';
import { RoleAuthService } from './role-auth/role-auth.service';
import { RoleAuthController } from './role-auth/role-auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [LocalAuthController, GithubAuthController, RoleAuthController],
  providers: [
    // Service
    LocalAuthService,
    GithubAuthService,
    RoleAuthService,
    // 鉴权策略
    LocalStrategy,
    JwtStrategy,
    GithubStrategy,
  ],
  exports: [RoleAuthService],
})
export class AuthModule {}
