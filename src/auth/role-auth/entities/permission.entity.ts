import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn({ comment: '权限id' })
  @ApiProperty()
  id: number;

  @Column({ comment: '权限标识' })
  @Exclude()
  key: string;

  @Column({ comment: '权限名' })
  @ApiProperty()
  name: string;

  @Column({ comment: '权限描述', default: '暂无' })
  @ApiProperty()
  desc: string;

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
}
