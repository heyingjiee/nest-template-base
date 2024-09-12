import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../common/filter/global-exception.filter';

@Catch()
export class GithubAuthExceptionFilter extends GlobalExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    super.catch(
      new UnauthorizedException(
        exception.name === 'InternalOAuthError'
          ? 'Github Access Token获取失败'
          : '授权失败',
        exception.message,
      ),
      host,
    );
  }
}
