<template>
  <ul class="bs-menu" role="menu">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance
} from 'vue';
import { bsMenuProps } from './bs-menu-props';

export default defineComponent({
  name: 'BsMenu',
  props: bsMenuProps,
  setup (props: any, ctx:any) {
    console.log(getCurrentInstance());
    return {};
  }
});
</script>

<style lang="scss">
@import "bs-menu.scss";
</style>
