import { Module } from '@nestjs/common';
import { FileOperateService } from './file-operate.service';
import { UploadController } from './upload.controller';
import { DownloadController } from './download.controller';

@Module({
  controllers: [UploadController, DownloadController],
  providers: [FileOperateService],
})
export class FileOperateModule {}
