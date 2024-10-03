import { ResponseType } from '@/common/type/response.interface';

export function responseSuccess<T = any>(
  data: T,
  message: string = 'ok',
): ResponseType<T> {
  return {
    code: '000000',
    data,
    message,
  };
}
