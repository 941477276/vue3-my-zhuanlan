<template>
  <teleport :disabled="!teleported" :to="appendTo">
    <transition
      :name="`popper-${transitionName}`">
      <BsPopperContent
        v-if="display"
        v-show="visible"
        v-bind="$attrs"
        :placement="placement"
        :visible="visible"
        :arrow-offset="arrowOffset"
        :popper-class="popperClass"
        :popper-options="popperOptions"
        :popper-style="popperStyle"
        :offset="offset"
        :z-index="zIndex"
        :strategy="strategy"
        :gpu-acceleration="gpuAcceleration">
        <slot v-if="!destroyed"></slot>
      </BsPopperContent>
    </transition>
  </teleport>
</template>

<script lang="ts">
import {
  ref,
  PropType,
  computed,
  defineComponent,
  onBeforeUnmount
} from 'vue';
import BsPopperContent from '../bs-popper/BsPopperContent.vue';
import { bsPopperContentProps } from '../bs-popper/bs-popper-content-props';
import { bsTooltipContentProps } from './bs-tooltip-content-props';

export default defineComponent({
  name: 'BsTooltipContent',
  components: {
    BsPopperContent
  },
  props: {
    ...bsPopperContentProps,
    ...bsTooltipContentProps
  },
  setup () {
    let destroyed = ref(false);

    // 是否渲染
    let display = computed(function () {
      return true;
    });

    onBeforeUnmount(function () {
      destroyed.value = true;
    });
    return {
      destroyed,
      display
    };
  }
});
</script>

<style lang="scss">

</style>
