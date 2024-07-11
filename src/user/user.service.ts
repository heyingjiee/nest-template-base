import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as md5 from 'md5';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CustomLogger } from '../common/logger/logger.module';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  @Inject()
  private readonly logger: CustomLogger;

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.FORBIDDEN);
    }

    if (md5(loginUserDto.password) !== user.password) {
      throw new HttpException('用户密码错误', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async register(registerUserDto: RegisterUserDto) {
    const findUser = await this.userRepository.findOneBy({
      username: registerUserDto.username,
    });

    if (findUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.username = registerUserDto.username;
    newUser.password = md5(registerUserDto.password);

    try {
      await this.userRepository.save(newUser);
    } catch (err) {
      return new Error(err);
    }
  }

  // 根据userId查询用户、角色信息
  async findRolesByUserId(id: number) {
    return this.entityManager.findOne(User, {
      where: {
        id,
      },
      relations: {
        roles: true,
      },
    });
  }
  // 根据角色查询
  async findPermissionsByRoleIds(rolesId: number[]) {
    return this.entityManager.find(Role, {
      where: {
        id: In(rolesId),
      },
      relations: {
        permissions: true,
      },
    });
  }

  async initData() {
    const user1 = new User();
    user1.username = 'jack';
    user1.password = 'jack';

    const user2 = new User();
    user2.username = 'tom';
    user2.password = 'tom';

    const role1 = new Role();
    role1.name = '管理员';
    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.name = 'add';
    permission1.desc = '新增权限';
    const permission2 = new Permission();
    permission2.name = 'delete';
    permission2.desc = '删除权限';

    role1.permissions = [permission1];
    role2.permissions = [permission2];

    user1.roles = [role1];
    user2.roles = [role2];

    // 这里注意必须保证这个顺序。例如：只有权限入库了，保存角色时，才能让权限id、角色id保存到中间表中
    await this.entityManager.save(Permission, [permission1, permission2]);
    await this.entityManager.save(Role, [role1, role2]);
    await this.entityManager.save(User, [user1, user2]);
  }
}
