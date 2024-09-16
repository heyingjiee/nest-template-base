import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleAuthService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

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
}
