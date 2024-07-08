export interface responseType<T = any> {
  code: number;
  data: T;
  msg: string;
}

export function responseError(
  err: Error,
  code: number = -1,
): responseType<null> {
  return {
    code,
    data: null,
    msg: err.message,
  };
}

export function responseSuccess<T = any>(
  data: T,
  msg: string = 'ok',
): responseType<T> {
  return {
    code: 0,
    data,
    msg,
  };
}
