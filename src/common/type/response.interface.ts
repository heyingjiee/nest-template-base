export class ResponseType<T = any> {
  code: string;
  data: T;
  message: string;
}

export class IPLocateType {
  ip: string;
  pro: string;
  proCode: string;
  city: string;
  cityCode: string;
  region: string;
  regionName: string;
  regionCode: string;
  addr: Buffer;
  err: string;
}
