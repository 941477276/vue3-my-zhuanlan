<template>
  <li class="bs-menu-item-group">
    <div class="bs-menu-item-group-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <ul class="bs-menu-item-group-content">
      <slot></slot>
    </ul>
  </li>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsMenuItemGroup',
  props: {
    title: { // 标题
      type: String,
      default: ''
    }
  }
});
</script>
