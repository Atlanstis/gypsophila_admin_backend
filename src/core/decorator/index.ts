import { SetMetadata } from '@nestjs/common';

export const RequirePermission = (permission: string | string[]) => {
  if (typeof permission === 'string') {
    permission = [permission];
  }
  return SetMetadata('require-permission', permission);
};
