import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { Repository } from 'typeorm';

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
}
