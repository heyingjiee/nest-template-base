import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../common/filter/global-exception.filter';

@Catch(UnauthorizedException)
export class JwtAuthExceptionFilter extends GlobalExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    super.catch(
      new UnauthorizedException(exception.message ?? '未授权请求'),
      host,
    );
  }
}
