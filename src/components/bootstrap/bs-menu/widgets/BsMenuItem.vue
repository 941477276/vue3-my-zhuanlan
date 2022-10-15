<template>
  <li class="bs-menu-item" role="menuitem" aria-disabled="false">
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
  defineComponent
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';

export default defineComponent({
  name: 'BsMenuItem',
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
