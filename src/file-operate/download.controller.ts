import { Controller, Get, Inject, Res, StreamableFile } from '@nestjs/common';
import { CustomLogger } from '../common/logger/logger.module';
import appConfig from '../common/configs/config';
import { Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { zip } from 'compressing';
import { ApiOperation } from '@nestjs/swagger';

@Controller('file-operate')
export class DownloadController {
  @Inject()
  private readonly logger: CustomLogger;

  // 完整下载
  @ApiOperation({ summary: '完整下载', description: '' })
  @Get('single-download')
  download(@Res() res: Response) {
    const content = fs.readFileSync(
      path.resolve(appConfig.sourceDir, 'public/images/bg.jpg'),
    );
    // res.setHeader('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment;filename="bg.jpg"`);

    res.end(content);
  }

  // 流式下载
  @ApiOperation({ summary: '流式下载', description: '' })
  @Get('stream-download')
  download3() {
    const destPath = path.resolve(appConfig.sourceDir, 'public/images/bg.jpg');
    const stream = fs.createReadStream(destPath);
    return new StreamableFile(stream, {
      disposition: `attachment;filename="bg.jpg"`,
    });
    // 响应头默认添加 Transfer-Encoding:chunked 即开启分片传输
  }

  // 压缩下载 （ pnpm i compressing ）
  @ApiOperation({ summary: '打包压缩下载', description: '' })
  @Get('compress-stream-download')
  async streamDownload(@Res() res: Response) {
    // 可以是文件、目录。如果是目录则会打包为一个压缩包
    const destPath = path.resolve(appConfig.sourceDir, 'public/images/bg.jpg');
    const tarStream = new zip.Stream();
    tarStream.addEntry(destPath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment;filename="download.zip"`); //可指定文件名

    tarStream.pipe(res);
  }
}
