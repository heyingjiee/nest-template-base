import { FileValidator } from '@nestjs/common';

interface customFileTypeValidatorOption {
  fileTypes: string[];
  message?: string;
}

/**
 * ParseFilePipe 的 validator
 */
export class customFileTypeValidator extends FileValidator<customFileTypeValidatorOption> {
  constructor(public options: customFileTypeValidatorOption) {
    super(options);
  }

  // 校验
  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    if (this.options.fileTypes.includes(file.mimetype)) {
      return true;
    }
    return false;
  }

  // 校验失败，抛出错误信息
  buildErrorMessage(): string {
    return this.options.message ?? `文件类型校验失败`;
  }
}
