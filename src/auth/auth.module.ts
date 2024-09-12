import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.startegy';
import { GithubStrategy } from './strategy/github.strategy';
import { LocalAuthService } from './service/index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [LocalAuthService, LocalStrategy, JwtStrategy, GithubStrategy],
})
export class AuthModule {}
