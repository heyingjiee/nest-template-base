import { Module } from '@nestjs/common';
import { FileOperateService } from './file-operate.service';
import { FileOperateController } from './file-operate.controller';

@Module({
  controllers: [FileOperateController],
  providers: [FileOperateService],
})
export class FileOperateModule {}
