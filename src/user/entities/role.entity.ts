import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({
    comment: '角色id',
  })
  @ApiHideProperty()
  @Exclude()
  id: number;

  @Column({ comment: '角色名' })
  @ApiProperty()
  name: string;

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

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permission_relation' })
  permissions: Permission[];
}
