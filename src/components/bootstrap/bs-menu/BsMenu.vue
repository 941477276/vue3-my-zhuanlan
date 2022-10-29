<template>
  <ul
    class="bs-menu"
    :class="[
      `bs-menu-${mode}`,
      {
        'bs-menu-collapsed': collapse
      }
    ]"
    role="menu">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  computed,
  provide,
  ref,
  reactive
} from 'vue';
import { bsMenuProps } from './bs-menu-props';
import {
  bsSubMenuDisplayMode,
  bsMenuRootInjectKey,
  MenuItemResgisted
} from '@/ts-tokens/bootstrap/menu';

let menuCount = 0;
export default defineComponent({
  name: 'BsMenu',
  props: bsMenuProps,
  setup (props: any, ctx:any) {
    let menuId = `bs-menu_${++menuCount}`;
    // 子菜单展现形式
    let subMenuDisplayModeInner = computed(function () {
      let {
        mode,
        collapse,
        subMenuDisplayMode
      } = props;
      mode = mode?.toLowerCase();

      if (mode == 'horizontal') {
        return bsSubMenuDisplayMode.dropdown;
      }
      if (mode == 'vertical') {
        if (collapse) {
          return bsSubMenuDisplayMode.dropdown;
        }
        if (!subMenuDisplayMode) {
          return bsSubMenuDisplayMode.collapse;
        }
        return subMenuDisplayMode;
      }
      if (mode == 'h5') {
        if (!subMenuDisplayMode) {
          return bsSubMenuDisplayMode.collapse;
        }
        return subMenuDisplayMode;
      }
      return bsSubMenuDisplayMode.collapse;
    });
    console.log(getCurrentInstance());

    // 已注册的submenu
    let registedSubMenus = reactive<Record<string, MenuItemResgisted>>({});
    // 展开的submenu
    let expandedSubMenuIds = reactive<Record<string, string>>({});
    // 已注册的menuitem
    let registedMenuItems = reactive<Record<string, MenuItemResgisted>>({});

    provide(bsMenuRootInjectKey, {
      subMenuDisplayModeInner,
      props,
      registedMenuItems,
      addSubMenu (submenu: MenuItemResgisted) {
        registedSubMenus[submenu.id] = submenu;
      },
      removeSubMenu (submenuId: string) {
        delete registedSubMenus[submenuId];
      },
      addMenuItem (menu: MenuItemResgisted) {
        registedMenuItems[menu.id] = menu;
      },
      removeMenuItem (menuId: string) {
        delete registedMenuItems[menuId];
      },
      // 获取所有已经注册的菜单项
      getRegistedMenuItems () {
        return Object.values(registedMenuItems);
      },
      // 根据菜单项的keyIndex查找菜单项
      findMenuItemByKeyIndex (keyIndex: string|number) {
        let result;
        for (let attr in registedMenuItems) {
          let menuItem = registedMenuItems[attr];
          if (menuItem.keyIndex.value === keyIndex) {
            result = menuItem;
          }
        }
        return result;
      },
      expandedSubMenu (submenuId: string, isExpanded: boolean) {
        if (isExpanded) {
          expandedSubMenuIds[submenuId] = submenuId;
        } else {
          delete expandedSubMenuIds[submenuId];
        }
      }
    });
    return {
      comId: menuId,
      subMenuDisplayModeInner,
      expandedSubMenuIds,
      registedMenuItems
    };
  }
});
</script>

<style lang="scss">
@import "bs-menu.scss";
</style>
