import {
  ComputedRef,
  Ref
} from 'vue';
// 菜单类型
export type BsMenuMode = 'horizontal' | 'vertical' | 'h5';

// 子菜单展现模式类型
export type BsSubMenuDisplayMode = 'collapse' | 'dropdown' | 'drawer';

export interface MenuItemResgisted {
  keyIndex: ComputedRef<string>;
  id: string;
  name: string;
  disabled: Ref<boolean>;
  parentsIdPath: Record<string, string>[];
  // parentMenuId: string;
  expandSubmenu?: (flag?: boolean) => void;
};

// 子菜单展现模式
export const bsSubMenuDisplayMode = {
  collapse: 'collapse',
  dropdown: 'dropdown',
  drawer: 'drawer'
};

export const bsMenuRootInjectKey = 'bsMenuRoot';
