import { Menu } from 'src/entities';

export type MenuBusiness = Omit<Menu, 'createTime' | 'updateTime'> & {
  children?: MenuBusiness[];
};

/**
 * 整理顶级菜单的子菜单
 * @param menus 顶级菜单
 * @param children 子菜单
 * @returns 菜单
 */
export function sortMenuChildren(menus: Menu[], children: Menu[]) {
  const parents = menus as MenuBusiness[];
  children.forEach((child) => {
    const father = parents.find((parent) => parent.id === child.parentId);
    if (father) {
      if (father.children) {
        father.children.push(child);
      } else {
        father.children = [child];
      }
    }
  });
  parents.forEach((parent) => {
    if (parent.children) {
      parent.children.sort((a, b) => a.order - b.order);
      parent.children.forEach((child) => {
        child.permissions &&
          child.permissions.sort((a, b) => a.order - b.order);
      });
    }
  });
  return parents;
}
