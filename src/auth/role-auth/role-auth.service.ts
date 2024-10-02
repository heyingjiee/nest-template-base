import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from '@/auth/role-auth/dto/role.dto';
import {
  RoleExistException,
  RoleNoneExistException,
} from '@/common/exception/auth.exception';

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

  // 创建角色
  async createRole(createRoleDto: CreateRoleDto): Promise<boolean> {
    const { name } = createRoleDto;
    const findRoleRes = await this.entityManager.findOneBy(Role, {
      name,
    });

    if (findRoleRes !== null) {
      throw new RoleExistException();
    }

    await this.entityManager.insert(Role, {
      name,
    });

    return true;
  }

  // 删除角色
  async deleteRoleById(roleId: number) {
    const isExist = await this.entityManager.exists(Role, {
      where: {
        id: roleId,
      },
    });

    if (!isExist) {
      throw new RoleNoneExistException();
    }

    const { affected } = await this.entityManager.delete(Role, {
      id: roleId,
    });

    return affected > 0;
  }

  // 全部角色
  async findAllRole() {
    return this.entityManager.find(Role);
  }
  // 查询角色拥有的权限
  async findPermissionByRoleId(roleId: number) {
    const res = await this.entityManager.find(Role, {
      where: {
        id: roleId,
      },
      relations: {
        permissions: true,
      },
    });

    return res;
  }
}
