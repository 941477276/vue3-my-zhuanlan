<template>
  <option
    :value="value"
    :disabled="disabled">
    <slot>{{ label }}</slot>
  </option>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BsOption',
  props: {
    value: {
      type: [String, Number],
      default: null
    },
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
