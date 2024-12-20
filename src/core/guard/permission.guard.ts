import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { BusinessException } from '../exception';
import { RoleService } from 'src/modules/management/role/role.service';
import { hasCommonString } from 'src/utils';
import { REQUIRE_PERMISSION } from 'src/core';

/** 检查接口的访问的权限，配合 JwtGuard 与 RequirePermission() 使用 */
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RoleService)
  private readonly roleService: RoleService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const methodPermissions = this.reflector.getAllAndOverride(
      REQUIRE_PERMISSION,
      [context.getHandler(), context.getClass()],
    ) as string[];
    if (!request.user) {
      throw new BusinessException('请先进行登录');
    }

    const permissions = await this.roleService.getRolePermissionsFromRedis(
      request.user.roleIds,
    );

    const flag = hasCommonString(permissions, methodPermissions);
    if (!flag) {
      throw new BusinessException('无访问该接口的权限');
    }
    return true;
  }
}
