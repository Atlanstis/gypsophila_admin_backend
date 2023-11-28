import { BusinessException } from 'src/core';
import { RoleEnum } from 'src/enum';
import { RoleService } from 'src/role/role.service';

/**
 * 判断角色是否合规
 * @param service 角色服务
 * @param roleId 角色服务
 * @param adminMessage 与管理员相关的报错信息
 * @returns 角色
 */
export async function handleRoleJudge(service: RoleService, roleId: number, adminMessage: string) {
  const role = await service.findRoleById(roleId);
  if (!role) {
    throw new BusinessException('该角色不存在');
  }
  // 不允许成为管理员
  if (role.id === RoleEnum.Admin) {
    throw new BusinessException(adminMessage);
  }
  return role;
}
