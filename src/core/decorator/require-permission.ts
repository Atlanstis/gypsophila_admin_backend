import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSION = 'require-permission';

export const RequirePermission = (permission: string | string[]) => {
  if (typeof permission === 'string') {
    permission = [permission];
  }
  return SetMetadata(REQUIRE_PERMISSION, permission);
};
