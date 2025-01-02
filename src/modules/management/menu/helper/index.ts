export type MenuSort = Omit<ResMenu.MenuListData, 'permission' | 'children'> & {
  children?: MenuSort[];
};
/**
 * 整理顶级菜单的子菜单
 * @param menus 顶级菜单
 * @param children 子菜单
 * @returns 菜单
 */
export function sortMenuChildren(menus: MenuSort[], children: MenuSort[]) {
  const parents: MenuSort[] = menus.map((item) => ({ ...item, children: [] }));
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
        child.permissions?.sort((a, b) => a.order - b.order);
      });
    }
  });
  return parents;
}
