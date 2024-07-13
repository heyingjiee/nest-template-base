import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ comment: '用户id' })
  @Exclude()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  @ApiProperty()
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  @ApiHideProperty()
  @Exclude()
  password: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  @ApiProperty()
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  @ApiProperty()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_role_relation' }) // 默认生成的中间表名：user_roles_role,即 表名A_关联字段_表名B。name字段可以指定表名
  @ApiProperty({ type: Role })
  roles: Role[];
}
