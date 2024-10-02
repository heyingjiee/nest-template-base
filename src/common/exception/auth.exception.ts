import {
  BusinessBaseException,
  BusinessExceptionDataType,
} from '@/common/exception/business-base.exception';
import { HttpStatus } from '@nestjs/common';

/**
 *  认证与鉴权相关异常 `02开头`
 */
export class AuthException extends BusinessBaseException {
  constructor(
    exceptionDate?: BusinessExceptionDataType,
    httpStatus: HttpStatus = HttpStatus.OK,
  ) {
    super(
      exceptionDate ?? {
        code: '020000',
        data: null,
        message: '认证与鉴权业务异常',
      },
      httpStatus,
    );
  }
}

/**
 * 身份认证失败
 */
export class UnauthorizedAuthException extends AuthException {
  constructor(exceptionDate?: Partial<BusinessExceptionDataType>) {
    const defaultExceptionData: BusinessExceptionDataType = {
      code: '020001',
      data: null,
      message: '身份认证失败',
    };
    super(
      {
        ...defaultExceptionData,
        ...exceptionDate,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * 鉴权失败
 */
export class ForbiddenAuthException extends AuthException {
  constructor(exceptionDate?: Partial<BusinessExceptionDataType>) {
    super(
      {
        code: '020002',
        data: null,
        message: '鉴权失败，禁止访问',
        ...exceptionDate,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * 当前角色已存在
 */
export class RoleExistException extends AuthException {
  constructor(exceptionDate?: Partial<BusinessExceptionDataType>) {
    super({
      code: '020201',
      data: null,
      message: '当前角色已存在',
      ...exceptionDate,
    });
  }
}
/**
 * 当前角色不已存在
 */
export class RoleNoneExistException extends AuthException {
  constructor(exceptionDate?: Partial<BusinessExceptionDataType>) {
    super({
      code: '020202',
      data: null,
      message: '当前角色不存在',
      ...exceptionDate,
    });
  }
}
