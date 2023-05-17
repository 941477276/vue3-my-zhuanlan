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
  defineComponent
} from 'vue';
import { bsSpinnerProps } from './bs-spinner-props';

export default defineComponent({
  name: 'BsSpinner',
  props: {
    ...bsSpinnerProps
  }
});
</script>
