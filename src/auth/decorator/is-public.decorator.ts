import { SetMetadata } from '@nestjs/common';

// 标记开放接口，不校验JWT
export const IsPublic = () => SetMetadata('is-public', true);
