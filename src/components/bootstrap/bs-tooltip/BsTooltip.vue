<template>
  <BsPopper>
    <BsTooltipTrigger
      :virtual-triggering="virtualTriggering"
      :virtual-ref="virtualRef"
      :disabled="disabled">
      <slot v-if="$slots.default"></slot>
    </BsTooltipTrigger>

    <BsTooltipContent
      v-bind="$attrs"
      :popper-class="popperClass || 'bs-tooltip'"
      :visible="isShow"
      :placement="placement"
      :arrow-offset="arrowOffset"
      :popper-options="popperOptions"
      :popper-style="popperStyle"
      :offset="offset"
      :z-index="zIndex"
      :strategy="strategy"
      :gpu-acceleration="gpuAcceleration">
      <slot name="content">
        <div v-if="!rawContent">
          {{ content }}
        </div>
        <div v-else v-html="content"></div>
      </slot>

      <BsPopperArrow
        v-if="showArrow"
        :arrow-class="arrowClass"></BsPopperArrow>
    </BsTooltipContent>
  </BsPopper>
</template>

<script lang="ts">
import {
  cloneVNode,
  defineComponent,
  PropType,
  ref,
  provide,
  toRef,
  readonly
} from 'vue';
import {
  PopperTriggerType,
  BsTooltipContext,
  bsTooltipContextKey
} from '@/ts-tokens/bootstrap/popper';
import BsPopper from '../bs-popper/BsPopper.vue';
// import BsPopperTrigger from '../bs-popper/BsPopperTrigger.vue';
// import BsPopperContent from '../bs-popper/BsPopperContent.vue';
import BsPopperArrow from '../bs-popper/BsPopperArrow.vue';
import { bsPopperContentProps } from '../bs-popper/bs-popper-content-props';
import { bsTooltipContentProps } from './bs-tooltip-content-props';
import BsTooltipContent from './BsTooltipContent.vue';
import BsTooltipTrigger from './BsTooltipTrigger.vue';

export default defineComponent({
  name: 'BsTooltip',
  components: {
    BsPopper,
    // BsPopperTrigger,
    // BsPopperContent,
    BsPopperArrow,
    BsTooltipContent,
    BsTooltipTrigger
  },
  props: {
    ...bsPopperContentProps,
    ...bsTooltipContentProps,
    trigger: {
      type: String as PropType<PopperTriggerType>,
      default: 'hover'
    },
    id: {
      type: String,
      default: ''
    },
    showArrow: { // 是否显示三角箭头
      type: Boolean,
      default: true
    },
    arrowClass: { // 三角箭头的class
      type: String,
      default: ''
    },
    virtualTriggering: { // 是否由虚拟元素触发
      type: Boolean,
      default: false
    },
    virtualRef: { // 触发元素的ref
      type: [String, Function, Object],
      default: null
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  setup (props: any) {
    let triggerElType = ref(1);
    let setTriggerEl = function (type: number) {
      triggerElType.value = type;
    };

    let isShow = ref(false);

    let show = function () {
      if (props.disabled) {
        return;
      }
      isShow.value = true;
    };

    let hide = function () {
      if (props.disabled) {
        return;
      }
      isShow.value = false;
    };

    let onClick = function () {
      console.log('trigger click');
      isShow.value = !isShow.value;
    };

    provide<BsTooltipContext>(bsTooltipContextKey, {
      show,
      hide,
      trigger: toRef(props, 'trigger'),
      isShow: readonly(isShow)
    });

    return {
      triggerElType,
      setTriggerEl,
      isShow,

      show,
      hide,
      onClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-tooltip";
</style>
