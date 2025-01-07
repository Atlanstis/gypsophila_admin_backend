import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSION = 'require-permission';

/**
 * 创建一个装饰器，用于标记接口访问需要的权限，配合 'PermissionGuard' 使用。
 * @param keys - 需要的权限键，可以是一个字符串或字符串数组。
 * @param type - 权限类型，默认为 'permission'。type 为 'permission' 时，通过具体的权限来判断；为 'menu' 时，通过是否可以访问菜单来判断。
 * @returns - 一个装饰器函数，用于设置元数据。
 */
export const RequirePermission = (
  keys: string | string[],
  type: App.PermissionGuardData['type'] = 'permission',
) => {
  if (typeof keys === 'string') {
    keys = [keys];
  }
  const val: App.PermissionGuardData = { keys, type };
  return SetMetadata(REQUIRE_PERMISSION, val);
};
