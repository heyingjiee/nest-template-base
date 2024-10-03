export class ResponseType<T = any> {
  code: string;
  data: T;
  message: string;
}
