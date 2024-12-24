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

export class CheckSignFailException extends CommonException {
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
 * 请求过期异常
 */
export class TimeOverdueException extends CommonException {
  constructor(exceptionDate?: Partial<BusinessExceptionDataType>) {
    super({
      code: '010200',
      data: null,
      message: '请求已过期',
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
      code: '010300',
      data: null,
      message: '参数校验失败',
      ...exceptionDate,
    });
  }
}
