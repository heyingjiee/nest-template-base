import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  UnauthorizedAuthException,
  UserNoneExistException,
} from '@/common/exception/auth.exception';

export interface LastLoginDto {
  lastLoginIP: string;
  lastLoginAddr: string;
  lastLoginTime: Date;
}

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  updateUserLastLoginData(userId: number, lastLoginDto: LastLoginDto) {
    return this.userRepository.update(userId, lastLoginDto);
  }

  async findRolesByUserId(userId: number) {
    try {
      return await this.userRepository.findOneByOrFail({ id: userId });
    } catch (err) {
      throw new UserNoneExistException();
    }
  }
}
