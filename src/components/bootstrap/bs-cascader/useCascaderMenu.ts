import {
  Ref,
  ref
} from 'vue';
import { CascaderOptionItem, CascaderExpandedMenuItem } from '@/ts-tokens/bootstrap/cascader';

export function useCascaderMenu (props: any, ctx: any, expandedMenus: Ref<CascaderExpandedMenuItem[]>) {
  // 选中项列表
  let checkedMenuValues = ref<(string|number)[]>([]);

  // 添加菜单到展开列表
  let pushMenuToExpanded = function (menuOption: CascaderOptionItem, cascaderMenuId: string) {
    let menuChildren = menuOption.children;
    if (menuChildren && menuChildren.length > 0) {
      let index = expandedMenus.value.findIndex(menuItem => menuItem.menuId === cascaderMenuId);
      let newMenu = {
        menuId: cascaderMenuId,
        menuItemValue: menuOption.value,
        menuOptions: menuChildren
      };
      if (index > -1) {
        let removeCount = expandedMenus.value.length - index;
        if (cascaderMenuId === 'bs-cascader-menu_1') {
          expandedMenus.value[0].menuItemValue = menuOption.value;
          newMenu.menuItemValue = '';
          // 如果当前展开的是第一个菜单的子菜单，则将当前菜单后面到菜单都移除掉，并替换成新的菜单
          expandedMenus.value.splice(index + 1, removeCount, newMenu);
        } else {
          // 将当前菜单及起后面的菜单都移除掉，并替换成新的菜单
          expandedMenus.value.splice(index, removeCount, newMenu);
        }
      } else {
        expandedMenus.value.push(newMenu);
      }
    }
  };

  let handleMenuItemClick = function (menu: CascaderOptionItem, cascaderMenuId: string) {
    console.log('菜单项点击了：', menu, cascaderMenuId);
    pushMenuToExpanded(menu, cascaderMenuId);
  };

  let handleMenuItemChecked = function (menu: CascaderOptionItem, cascaderMenuId: string) {
    console.log('菜单选中了', menu, cascaderMenuId);
    let value = menu.value;
    if (!props.multiple) {
      checkedMenuValues.value = [value];
    } else if (!checkedMenuValues.value.includes(value)) {
      checkedMenuValues.value.push(value);
    }
  };

  return {
    checkedMenuValues,
    handleMenuItemClick,
    handleMenuItemChecked
  };
};
