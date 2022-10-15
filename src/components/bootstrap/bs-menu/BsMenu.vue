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
  provide
} from 'vue';
import { bsMenuProps } from './bs-menu-props';
import {
  bsSubMenuDisplayMode,
  bsMenuRootInjectKey
} from '@/ts-tokens/bootstrap/menu';

export default defineComponent({
  name: 'BsMenu',
  props: bsMenuProps,
  setup (props: any, ctx:any) {
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
    provide(bsMenuRootInjectKey, {
      subMenuDisplayModeInner,
      props
    });
    return {
      subMenuDisplayModeInner
    };
  }
});
</script>

<style lang="scss">
@import "bs-menu.scss";
</style>
