<template>
<div class="demo-index">
  <Basic></Basic>
  <Vertical></Vertical>
  <VerticalUniqueOpened></VerticalUniqueOpened>
  <CollapseMenu></CollapseMenu>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import Vertical from './vertical.vue';
import VerticalUniqueOpened from './vertical-unique-opened.vue';
import CollapseMenu from './collapse-menu.vue';

export default defineComponent({
  name: 'DemoIndex',
  components: {
    Basic,
    Vertical,
    VerticalUniqueOpened,
    CollapseMenu
  }
});
</script>
