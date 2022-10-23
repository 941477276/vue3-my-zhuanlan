<template>
  <BsTooltip
    v-if="parentIsMenuRoot && isCollapsed"
    :disabled="!isCollapsed"
    :content="tooltipContent"
    placement="right"
    transition-name="scale">
    <li
      class="bs-menu-item"
      :class="{
        'has-icon': icon || $slots.icon,
        'is-disabled': disabled
      }"
      :style="{
        paddingLeft: paddingLeft.value ? (paddingLeft.value + paddingLeft.unit): ''
      }"
      role="menuitem"
      :aria-level="keyIndexPath.length"
      :aria-disabled="disabled"
      @mouseenter="handleMouseenter">
      <span
        v-if="icon || $slots.icon"
        class="bs-menu-item-icon"
        role="img">
        <slot name="icon">
          <BsIcon :name="icon"></BsIcon>
        </slot>
      </span>
      <span class="bs-menu-item-title">
        <slot>{{ title }}</slot>
      </span>
    </li>
  </BsTooltip>
  <li
    v-else
    class="bs-menu-item"
    :class="{
        'has-icon': icon || $slots.icon,
        'is-disabled': disabled
      }"
    :style="{
        paddingLeft: paddingLeft.value ? (paddingLeft.value + paddingLeft.unit): ''
      }"
    role="menuitem"
    :aria-level="keyIndexPath.length"
    :aria-disabled="disabled"
    @mouseenter="handleMouseenter">
      <span
        v-if="icon || $slots.icon"
        class="bs-menu-item-icon"
        role="img">
        <slot name="icon">
          <BsIcon :name="icon"></BsIcon>
        </slot>
      </span>
      <span class="bs-menu-item-title">
        <slot>{{ title }}</slot>
      </span>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  computed,
  inject,
  ref
} from 'vue';
import BsTooltip from '../../bs-tooltip/BsTooltip.vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import { useMenuLevel } from '../hooks/useMenuLevel';
import { bsMenuRootInjectKey } from '@/ts-tokens/bootstrap/menu';

let menuItemCount = 0;
export default defineComponent({
  name: 'BsMenuItem',
  components: {
    BsIcon,
    BsTooltip
  },
  props: {
    keyIndex: { // 唯一标识，必填
      type: String,
      default: '',
      required: true
    },
    title: { // 标题
      type: String,
      default: ''
    },
    icon: { // 图标名称
      type: String,
      default: ''
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  setup (props: any, ctx: any) {
    let currentIns = getCurrentInstance()!;
    let menuItemId = `bs-menu-item_${++menuItemCount}`;
    // 根菜单提供的上下文
    let menuRootCtx = inject(bsMenuRootInjectKey) as any;

    let isCollapsed = computed(function () {
      return menuRootCtx?.props.collapse;
    });

    // 获取当前组件的父级菜单组件，层级路径，层级ID
    let {
      currentKeyIndex,
      keyIndexPath,
      parentMenu,
      paddingLeft
    } = useMenuLevel(currentIns, props, menuItemId);

    // 判断组件的父级组件是否为<bs-menu>组件
    let parentIsMenuRoot = computed(function () {
      let parent = parentMenu.value;
      if (!parent) {
        return false;
      }
      return parent.type.name == 'BsMenu';
    });

    let tooltipContent = ref('');
    let handleMouseenter = function (evt: MouseEvent) {
      let target = evt.target as HTMLElement;
      let titleEl = target.querySelector('.bs-menu-item-title');
      tooltipContent.value = (titleEl as any)?.innerText || titleEl?.textContent;
    };

    return {
      comId: menuItemId,
      currentKeyIndex,
      keyIndexPath,
      paddingLeft,
      isCollapsed,
      parentIsMenuRoot,
      tooltipContent,

      handleMouseenter
    };
  }
});
</script>
