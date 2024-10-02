import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString({ message: '角色名类型校验失败' })
  @Length(2, 10, { message: '角色名长度在2-10之间' })
  @IsNotEmpty({ message: '角色名不能为空' })
  name: string;
}
