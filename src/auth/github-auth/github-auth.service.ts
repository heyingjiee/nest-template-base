import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GithubRegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class GithubAuthService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  async register(githubRegisterUserDto: GithubRegisterUserDto) {
    const findUser = await this.userRepository.findOneBy({
      githubId: githubRegisterUserDto.githubId,
    });

    if (findUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.username = githubRegisterUserDto.username;
    newUser.githubId = githubRegisterUserDto.githubId;

    try {
      await this.userRepository.save(newUser);
    } catch (err) {
      return new Error(err);
    }
  }
}
