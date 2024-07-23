import { Controller, Get, Inject, Res } from '@nestjs/common';
import { CustomLogger } from '../common/logger/logger.module';
import appConfig from '../common/configs/config';
import { Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { zip } from 'compressing';

@Controller('file-operate')
export class DownloadController {
  @Inject()
  private readonly logger: CustomLogger;

  // 下载图片
  @Get('single-download')
  download(@Res() res: Response) {
    const content = fs.readFileSync(
      path.resolve(appConfig.sourceDir, 'public/assets/bg.png'),
    );

    res.set('Content-Disposition', `attachment;filename=bg.png`);

    res.end(content);
  }

  @Get('stream-download')
  async streamDownload(@Res() res: Response) {
    const destPath = path.resolve(appConfig.sourceDir, 'public/assets/bg.png');
    const tarStream = new zip.Stream();
    tarStream.addEntry(destPath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment;filename=bg.png`); //可指定文件名

    tarStream.pipe(res);
  }
}
