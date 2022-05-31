<template>
  <svg class="bs-svg-icon" :class="`bsicon-${name}`" aria-hidden="true" v-bind="$attrs">
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
.bs-svg-icon{
  width: 1em;
  height: 1em;
  vertical-align: -3px;
  fill: currentColor;
  overflow: hidden;
}
</style>
