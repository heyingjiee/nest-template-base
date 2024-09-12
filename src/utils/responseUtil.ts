export interface responseType<T = any> {
  code: number;
  data: T;
  msg: string;
}

export function responseError<T = any>(
  data: T,
  err: Error,
  code: number = -1,
): responseType<T> {
  return {
    code,
    data,
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
