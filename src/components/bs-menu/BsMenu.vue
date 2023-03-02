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
  reactive,
  watch
} from 'vue';
import {
  isString
} from '@vue/shared';
import { bsMenuProps } from './bs-menu-props';
import {
  bsSubMenuDisplayMode,
  bsMenuRootInjectKey,
  MenuItemResgisted,
  ExpandedSubmenu
} from '../../ts-tokens/bootstrap/menu';

let menuCount = 0;
export default defineComponent({
  name: 'BsMenu',
  props: bsMenuProps,
  emits: ['openChange', 'itemClick', 'update:selectedKeys', 'select'],
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

    // 已注册的submenu
    let registedSubMenus = reactive<Record<string, MenuItemResgisted>>({});
    // 展开的submenu
    let expandedSubMenus = reactive<Record<string, ExpandedSubmenu>>({});
    // 展开的直接子submenu
    let expandedChildSubmenus = reactive<Record<string, ExpandedSubmenu>>({});
    // 已注册的menuitem
    let registedMenuItems = reactive<Record<string, MenuItemResgisted>>({});

    // 选中的菜单项
    let selectedKeysInner = ref<string[]>([]);
    watch(() => {
      let selectedKes = props.selectedKeys;
      if (isString(selectedKes)) {
        return selectedKes.split(',');
      }
      return [...selectedKes];
    }, function (selectedKes: string[]) {
      if (selectedKes.join(',') === selectedKeysInner.value.join(',')) {
        return;
      }
      selectedKeysInner.value = selectedKes;
    }, {
      immediate: true
    });

    provide(bsMenuRootInjectKey, {
      subMenuDisplayModeInner,
      props,
      registedMenuItems,
      selectedKeysInner,
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
      expandedSubMenu (submenu: ExpandedSubmenu, isExpanded: boolean) {
        if (isExpanded) {
          expandedSubMenus[submenu.id] = submenu;
        } else {
          delete expandedSubMenus[submenu.id];
        }
      },
      handChildSubmenuExpand (submenu: ExpandedSubmenu, isExpanded: boolean) {
        if (isExpanded) {
          // 如果开启了同层级只有一个子菜单展开，则收起其他菜单
          if (props.uniqueOpened) {
            for (let attr in expandedChildSubmenus) {
              expandedChildSubmenus[attr].shrinkSubmenu();
            }
            expandedChildSubmenus = {};
          }
          expandedChildSubmenus[submenu.id] = submenu;
        } else {
          delete expandedChildSubmenus[submenu.id];
        }
      },
      handleMenuItemSelect (keyIndex: string, keyPath: string[], isSelected: boolean) {
        selectedKeysInner.value = [keyIndex];
        ctx.emit('update:selectedKeys', [keyIndex]);
        ctx.emit('select', keyIndex, isSelected, keyPath);
      },
      emit (name: string, ...args: any) {
        ctx.emit(name, ...args);
      }
    });
    return {
      comId: menuId,
      subMenuDisplayModeInner,
      expandedSubMenus,
      expandedChildSubmenus,
      registedMenuItems,
      selectedKeysInner
    };
  }
});
</script>

<style lang="scss">
@import "bs-menu.scss";
</style>
