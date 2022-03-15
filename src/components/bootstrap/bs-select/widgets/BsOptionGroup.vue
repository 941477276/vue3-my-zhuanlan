<template>
  <optgroup
    :label="label"
    :disabled="disabled">
    <slot></slot>
  </optgroup>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BsOptionGroup',
  props: {
    label: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
});
</script>
