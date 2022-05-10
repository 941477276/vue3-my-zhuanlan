<template>
  <BsPopperTrigger
    :virtual-triggering="virtualTriggering"
    :virtual-ref="virtualRef"
    @click="onClick">
    <slot v-if="$slots.default"></slot>
  </BsPopperTrigger>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  PropType
} from 'vue';
import BsPopperTrigger from '../bs-popper/BsPopperTrigger.vue';
import { bsPopperTriggerProps } from '../bs-popper/bs-popper-trigger-props';
import {
  bsTooltipContextKey,
  BsTooltipContext,
  PopperTriggerType
} from '@/ts-tokens/bootstrap/popper';

export default defineComponent({
  name: 'BsTooltipTrigger',
  components: {
    BsPopperTrigger
  },
  props: {
    ...bsPopperTriggerProps,
    disabled: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: String as PropType<PopperTriggerType>,
      default: 'hover'
    }
  },
  setup (props: any) {
    let { show, hide, isShow } = inject<BsTooltipContext>(bsTooltipContextKey)!;

    let onClick = function () {
      if (props.disabled || props.trigger !== 'click') {
        return;
      }
      if (isShow.value) {
        hide();
      } else {
        show();
      }
    };
    return {
      onClick
    };
  }
});
</script>

<style lang="scss">

</style>
