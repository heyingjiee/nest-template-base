import {
  Body,
  Controller,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileOperateService } from './file-operate.service';
import { CustomLogger } from '../common/logger/logger.module';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { responseSuccess } from '../utils/responseUtil';
import { customFileTypeValidator } from './file.validator';
import { storage } from './file-interceptor.storage';

@ApiTags('file-upload')
@Controller('file-upload')
export class UploadController {
  @Inject()
  private readonly logger: CustomLogger;
  constructor(private readonly fileOperateService: FileOperateService) {}

  @ApiOperation({ summary: '单文件上传' })
  @Post('single-upload')
  @UseInterceptors(
    FileInterceptor('fileData', {
      // 使用内置拦截器FileInterceptor（需配合multer包使用）。fileData是上传文件的key，dest是上传文件放置的路径
      // dest: 'uploads', // 相对项目根路径。直接使用dest上传的文件没有后缀名，所以一般使用storage
      storage, // 使用multer.diskStorage({}) 创建 StorageEngine。diskStorage中可自定义文件路径、文件名
    }),
  )
  // @UploadedFile接收文件参数，@Body接收请求体（普通字段+文件字段）
  singleUploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 8 * 1024 * 100, // 单位byte
            message: '文件大小不能超过100KB',
          }),
          new customFileTypeValidator({
            fileTypes: ['image/png'],
            message: '文件类型只能是png',
          }),
        ],
      }),
    )
    fileData: Express.Multer.File,
    @Body() body,
  ) {
    console.log('fileData', fileData);
    console.log('body', body);
    return responseSuccess(null);
  }

  @ApiOperation({ summary: '多文件上传' })
  @Post('multi-upload')
  @UseInterceptors(
    // 1、取一个key
    // fileData是key，这个key对应的value最多3个文件
    FilesInterceptor('fileData', 3, {
      dest: 'uploads', // 相对项目根路径
      limits: {
        fileSize: 1024, //fileSize单文件限制 单位是B
        // fieldSize:xxx  value下全部文件大小之和的限制
      },
    }),

    // 取多个key中的文件
    // FileFieldsInterceptor(
    //   [
    //     { name: 'fileData1', maxCount: 3 },
    //     { name: 'fileData2', maxCount: 3 },
    //   ],
    //   {
    //     dest: 'uploads',
    //   },
    // ),
  )
  // FilesInterceptor、UploadedFiles，注意都比单文件的函数多一个s结尾，可接收多文件参数
  multiUploadFile(
    @UploadedFiles() fileData: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log('fileData', fileData);
    console.log('body', body);
    return responseSuccess(null);
  }

  @ApiOperation({ summary: '文件切片上传' })
  @Post('slice-upload')
  @UseInterceptors(
    FileInterceptor('fileData', {
      storage,
    }),
  )
  sliceUploadFile(@UploadedFile() fileData: Express.Multer.File, @Body() body) {
    console.log('fileData', fileData);
    console.log('body', body);
    return responseSuccess(null);
  }
}
