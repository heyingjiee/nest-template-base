import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsString({ message: 'username类型校验失败' })
  @IsNotEmpty({ message: 'username不能为空' })
  username: string;

  @ApiProperty()
  @IsString({ message: 'password类型校验失败' })
  @IsNotEmpty({ message: 'password不能为空' })
  password: string;
}
