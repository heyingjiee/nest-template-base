import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  // async initData() {
  //   const user1 = new User();
  //   user1.username = 'jack';
  //   user1.password = 'jack';
  //
  //   const user2 = new User();
  //   user2.username = 'tom';
  //   user2.password = 'tom';
  //
  //   const role1 = new Role();
  //   role1.name = '管理员';
  //   const role2 = new Role();
  //   role2.name = '普通用户';
  //
  //   const permission1 = new Permission();
  //   permission1.name = 'add';
  //   permission1.desc = '新增权限';
  //   const permission2 = new Permission();
  //   permission2.name = 'delete';
  //   permission2.desc = '删除权限';
  //
  //   role1.permissions = [permission1];
  //   role2.permissions = [permission2];
  //
  //   user1.roles = [role1];
  //   user2.roles = [role2];
  //
  //   // 这里注意必须保证这个顺序。例如：只有权限入库了，保存角色时，才能让权限id、角色id保存到中间表中
  //   await this.entityManager.save(Permission, [permission1, permission2]);
  //   await this.entityManager.save(Role, [role1, role2]);
  //   await this.entityManager.save(User, [user1, user2]);
  // }
}
