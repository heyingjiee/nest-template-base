import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CustomLogger } from '@/common/logger/logger.module';
@Injectable()
export class CheckSignGuard implements CanActivate {
  @Inject()
  private readonly logger: CustomLogger;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    this.logger.log(request.url, CheckSignGuard.name);
    return true;
  }
}
