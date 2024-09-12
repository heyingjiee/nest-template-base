import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
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
  // 根据githubId查询用户、角色信息
  async findRolesByGithubId(githubId: string) {
    return this.entityManager.findOne(User, {
      where: {
        githubId,
      },
      relations: {
        roles: true,
      },
    });
  }
  // 根据角色查询，角色下的权限
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
