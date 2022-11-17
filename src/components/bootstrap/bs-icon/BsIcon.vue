<template>
  <svg class="bs-svg-icon" :class="`bsicon-${name}`" aria-hidden="true">
    <use :xlink:href="iconId" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'BsIcon',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    }
  },
  setup (props: any) {
    let iconId = computed(() => {
      return `#bsicon-${props.name}`;
    });
    return {
      iconId
    };
  }
});
</script>

<style lang="scss">
@import "bs-icon";
</style>
