<template>
  <li class="bs-submenu" role="menu" aria-expanded="false" aria-disabled="false">
    <div class="bs-submenu-title">
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
  defineComponent
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';

export default defineComponent({
  name: 'BsSubMenu',
  components: {
    BsIcon
  },
  props: {
    key: { // 唯一标识，必填
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
  }
});
</script>
