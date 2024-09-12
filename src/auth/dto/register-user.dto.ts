import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocalRegisterUserDto {
  @ApiProperty()
  @IsString({ message: 'username类型校验失败' })
  @Length(6, 30, { message: 'username长度在6-30之间' })
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符',
  })
  @IsNotEmpty({ message: 'username不能为空' })
  username: string;

  @ApiProperty()
  @IsString({ message: 'password类型校验失败' })
  @Length(6, 30, { message: 'password长度在6-30之间' })
  @IsNotEmpty({ message: 'password不能为空' })
  password: string;
}

export class GithubRegisterUserDto {
  @ApiProperty()
  @IsString({ message: 'username类型校验失败' })
  @IsNotEmpty({ message: 'username不能为空' })
  username: string;

  @ApiProperty()
  @IsString({ message: 'githubId类型校验失败' })
  @IsNotEmpty({ message: 'githubId不能为空' })
  githubId: string;
}
