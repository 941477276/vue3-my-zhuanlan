<template>
  <transition
    :name="transitionName"
    @before-enter="collapseBeforeEnter"
    @enter="collapseEnter"
    @after-enter="collapseAfterEnter"
    @before-leave="collapseBeforeLeave"
    @leave="collapseLeave"
    @after-leave="collapseAfterLeave">
    <slot></slot>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCollapseTransition } from '@/hooks/useCollapseTransition';

/**
 * 元素折叠过度效果
 */
export default defineComponent({
  name: 'BsCollapseTransition',
  props: {
    transitionName: {
      type: String,
      default: 'collapse-transition'
    }
  },
  setup () {
    let transitionEvents = useCollapseTransition();

    return {
      ...transitionEvents
    };
  }
});
</script>

<style lang="scss">
@import "bs-collapse-transition";
</style>
