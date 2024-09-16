import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../common/filter/global-exception.filter';

@Catch()
export class GithubAuthExceptionFilter extends GlobalExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(
      `name:${exception.name}\n message:${exception.message}\n stack:${exception.stack}`,
      GithubAuthExceptionFilter.name,
    );
    const message =
      exception.name === 'InternalOAuthError'
        ? 'Github Access Token获取失败'
        : '授权失败';
    super.catch(new UnauthorizedException(message, { cause: exception }), host);
  }
}
