import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/role/role.service';
import { BusinessException } from '../exception';

/** 检查接口的访问的权限，配合 RequirePermission() 使用 */
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RoleService)
  private roleService: RoleService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const permission = this.reflector.getAllAndOverride('require-permission', [
      context.getHandler(),
      context.getClass(),
    ]);

    const permissions = (await this.roleService.getPermissionByRoleIds(request.user.roleIds)).map(
      (rmp) => rmp.permission.key,
    );
    if (!permissions.includes(permission)) {
      throw new BusinessException('无访问该接口的权限');
    }
    return true;
  }
}
