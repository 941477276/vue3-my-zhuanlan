<template>
  <div
    ref="popperContentRef"
    class="bs-popper"
    :class="popperClass"
    role="tooltip">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject
} from 'vue';
import {
  BsPopperContext,
  bsPopperContextKey
} from '@/ts-tokens/bootstrap/popper';
import { useZIndex } from '@/hooks/useZIndex';

export default defineComponent({
  name: 'BsPopperContent',
  props: {
    popperClass: { // popper的class
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 0
    }
  },
  setup () {
    let { popperContentRef } = inject<BsPopperContext>(bsPopperContextKey, {} as BsPopperContext);
    // let z
    return {
      popperContentRef
    };
  }
});
</script>

<style lang="scss">

</style>
