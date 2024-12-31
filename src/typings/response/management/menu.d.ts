declare namespace ResMenu {
  interface Menu {
    id: number;
    key: string;
    type: 'page' | 'menu';
    name: string;
  }

  interface MenuPermission {
    id: number;
    key: string;
    name: string;
    alias: string;
    order: number;
  }
}
