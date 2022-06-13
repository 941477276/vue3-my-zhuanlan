<template>
  <div
    class="bs-spinner"
    :class="[
      grow ? 'spinner-grow' : 'spinner-border',
      colorType ? `text-${colorType}` : ''
    ]"
    role="status">
    <span class="sr-only">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType
} from 'vue';
import { BsColorType } from '@/ts-tokens/bootstrap';

export default defineComponent({
  name: 'BsSpinner',
  props: {
    text: {
      type: String,
      default: 'Loading...'
    },
    colorType: {
      type: String as PropType<BsColorType>,
      default: ''
    },
    grow: { // 是否为增长式旋转器
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss">

</style>
