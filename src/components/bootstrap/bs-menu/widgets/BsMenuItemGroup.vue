<template>
  <li class="bs-menu-item-group">
    <slot></slot>
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
