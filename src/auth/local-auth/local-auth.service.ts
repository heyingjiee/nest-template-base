import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as md5 from 'md5';
import { User } from '../../user/entities/user.entity';
import { LocalRegisterUserDto } from './dto/register-user.dto';
import { LocalLoginUserDto } from './dto/login-user.dto';

@Injectable()
export class LocalAuthService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async login(localLoginUserDto: LocalLoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: localLoginUserDto.username,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.FORBIDDEN);
    }

    if (md5(localLoginUserDto.password) !== user.password) {
      throw new HttpException('用户密码错误', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async register(localRegisterUserDto: LocalRegisterUserDto) {
    const findUser = await this.userRepository.findOneBy({
      username: localRegisterUserDto.username,
    });

    if (findUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.username = localRegisterUserDto.username;
    newUser.password = md5(localRegisterUserDto.password);

    try {
      await this.userRepository.save(newUser);
    } catch (err) {
      return new Error(err);
    }
  }
}
