import {
  BusinessBaseException,
  BusinessExceptionDataType,
} from '@/common/exception/business-base.exception';

/**
 *  通用相关异常 `01开头`
 */
export class CommonException extends BusinessBaseException {
  constructor(exceptionDate?: BusinessExceptionDataType) {
    super({
      code: '010000',
      data: null,
      message: '通用业务异常',
      ...exceptionDate,
    });
  }
}

/**
 * 验签失败 checkFailException
 */

export class CheckFailException extends CommonException {
  constructor(exceptionDate?: Partial<BusinessExceptionDataType>) {
    super({
      code: '010100',
      data: null,
      message: '验签失败',
      ...exceptionDate,
    });
  }
}

/**
 * 参数检验失败
 */
export class ParamVerifyFailException extends CommonException {
  constructor(exceptionDate?: Partial<BusinessExceptionDataType>) {
    super({
      code: '010200',
      data: null,
      message: '参数校验失败',
      ...exceptionDate,
    });
  }
}
