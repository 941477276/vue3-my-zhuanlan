<template>
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
    :aria-disabled="disabled">
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
  computed
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import { useMenuLevel } from '../hooks/useMenuLevel';

let menuItemCount = 0;
export default defineComponent({
  name: 'BsMenuItem',
  components: {
    BsIcon
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

    // 获取当前组件的父级菜单组件，层级路径，层级ID
    let {
      currentKeyIndex,
      keyIndexPath,
      parentMenu,
      paddingLeft
    } = useMenuLevel(currentIns, props, menuItemId);

    return {
      comId: menuItemId,
      currentKeyIndex,
      keyIndexPath,
      paddingLeft
    };
  }
});
</script>
