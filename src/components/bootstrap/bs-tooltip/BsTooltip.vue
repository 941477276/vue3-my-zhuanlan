<template>
  <div class="bs-tooltip">
    <BsOnlyChild>
      <slot></slot>
    </BsOnlyChild>
  </div>
</template>

<script lang="ts">
import {
  cloneVNode,
  defineComponent
} from 'vue';
import { createPopper } from '@popperjs/core';
import BsOnlyChild from '../bs-slot/BsOnlyChild.vue';
export default defineComponent({
  name: 'BsTooltip',
  components: {
    BsOnlyChild
  }
});
</script>

<style lang="scss">

</style>
