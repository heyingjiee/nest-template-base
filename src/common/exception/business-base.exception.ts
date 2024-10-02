import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 全局业务异常基类(分为 3 级，每级2位。缺省级为 00)
 * 参考：https://developers.weixin.qq.com/miniprogram/dev/framework/usability/PublicErrno.html
 *
 * 一级类目：00 - 自定义错误码。不具有通用含义，其含义由具体接口自定义。 其中 000000 预留为业务正常返回
 *
 * 一级类目：01 - 通用错误
 *    二级类目：00 - 缺省值
 *    二级类目：01 - 验签失败
 *    二级类目：02 - 参数校验错误
 *    二级类目：03 - 解密错误
 *
 * 一级类目：02 - 认证与鉴权
 *    二级类目：00 鉴权失败类
 *        三级类目：00 - 缺省值
 *        三级类目：01 - 身份认证失败（用户没有提供正确的身份验证信息） UnauthorizedException 401
 *        三级类目：02 - 鉴权失败 （身份认证成功，但是该用户没有权限） ForbiddenException 403
 *    二级类目：01 - 用户类
 *        三级类目：01 - 用户已存在
 *    二级类目：02 - 角色类
 *        三级类目：01 - 角色已存在
 *        三级类目：02 - 角色不存在
 *
 * 一级类目：06 - 网络
 *    二级类目：00 - 缺省值
 *    二级类目：02 - 三方请求
 *    二级类目：03 - 下载
 *    二级类目：04 - 上传
 *
 * 一级类目：07 - 支付
 *    二级类目：00 - 缺省值
 *
 * 一级类目：11 - 媒体
 *
 * 一级类目：13 - 文件
 *    二级类目：00 - 通用文件错误
 *
 */

export type BusinessExceptionDataType = {
  code: string;
  message: string;
  data: any;
};
export class BusinessBaseException extends HttpException {
  public exceptionData: BusinessExceptionDataType;
  constructor(
    exceptionDate: BusinessExceptionDataType,
    httpStatus: HttpStatus = HttpStatus.OK,
  ) {
    super(exceptionDate, httpStatus);
    this.exceptionData = exceptionDate;
  }
}
