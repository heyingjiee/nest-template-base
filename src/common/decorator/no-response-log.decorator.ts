import { SetMetadata } from '@nestjs/common';

export const NoResponseLog = () => SetMetadata('no-response-log', true);
