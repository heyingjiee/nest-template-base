import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
