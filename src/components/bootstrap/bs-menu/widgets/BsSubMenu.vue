<template>
  <li class="bs-submenu" role="menu" aria-expanded="false" aria-disabled="false">
    <div
      class="bs-submenu-title"
      :class="{
        'has-icon': icon || $slots.icon
      }"
      :style="{
        paddingLeft: paddingLeft.value + paddingLeft.unit
      }">
      <span
        v-if="icon || $slots.icon"
        class="bs-menu-item-icon"
        role="img">
        <slot name="icon">
          <BsIcon :name="icon"></BsIcon>
        </slot>
      </span>
      <div class="bs-submenu-title-content">
        <slot name="title">{{ title }}</slot>
      </div>
      <span class="bs-submenu-arrow">
        <slot name="arrow">
          <BsIcon name="chevron-down"></BsIcon>
        </slot>
      </span>
    </div>
    <ul class="bs-submenu-content">
      <slot></slot>
    </ul>
  </li>
</template>

<script lang="ts">
import {
  defineComponent, getCurrentInstance
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import { useMenuLevel } from '@/components/bootstrap/bs-menu/hooks/useMenuLevel';

let subMenuCount = 0;
export default defineComponent({
  name: 'BsSubMenu',
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
    let subMenuId = `bs-submenu_${++subMenuCount}`;

    // 获取当前组件的父级菜单组件，层级路径，层级ID
    let {
      currentKeyIndex,
      keyIndexPath,
      parentMenu,
      paddingLeft
    } = useMenuLevel(currentIns, props, subMenuId);
    return {
      currentKeyIndex,
      keyIndexPath,
      paddingLeft
    };
  }
});
</script>
