<template>
  <BsTooltip
    :transition-name="tooltipTransitionName"
    :popper-class="tooltipClass"
    :placement="tooltipPlacement"
    :disabled="disabled"
    :visible="showToolTip"
    :content="modelValue">
    <div
      class="bs-slider-handler bs-slider-handler-1"
      :style="{
        left: sliderHandlerLeft + '%'
      }"
      @mousedown.prevent="onMousedown"></div>
  </BsTooltip>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
  unref,
  watch
} from 'vue';
import { bsSliderProps } from '../bs-slider-props';
import BsTooltip from '../../bs-tooltip/BsTooltip.vue';
import { BigNumber } from 'bignumber.js';
import { useSliderHandler } from './useSliderHandler';

export default defineComponent({
  name: 'BsSliderHandler',
  components: {
    BsTooltip
  },
  props: {
    ...bsSliderProps,
    modelValue: {
      type: Number,
      default: 0
    },
    sliderRef: {
      type: Object as PropType<HTMLElement|null>,
      default () {
        return {};
      }
    },
    precision: { // 小数点精度
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    // 计算百分比
    let percentage = computed<number>(function () {
      let propsMin = props.min;
      let propsMax = props.max;

      let min = new BigNumber(propsMin);
      let diff = new BigNumber(props.max).minus(min); // minus减法
      let value = props.modelValue;
      if (value < propsMin) {
        value = propsMin;
      }
      if (value > propsMax) {
        value = propsMax;
      }
      // dividedBy 除法
      return (new BigNumber(value).minus(min)).dividedBy(diff).toNumber();
    });

    // 计算滑块的left值
    let sliderHandlerLeft = computed(function () {
      let percentageVal = percentage.value;
      let value = new BigNumber(props.modelValue).minus(props.min);
      let sliderElWidth = (props.vertical ? unref(props.sliderRef)?.offsetHeight : unref(props.sliderRef)?.offsetWidth) || 0;
      let diff = new BigNumber(props.max).minus(props.min); // minus减法
      let result = new BigNumber(sliderElWidth).dividedBy(diff).multipliedBy(value);
      let left = result.dividedBy(sliderElWidth).toNumber() * 100;
      console.log('handlerLeft', left, diff.toNumber(), sliderElWidth);
      return left;
    });

    console.log(new BigNumber(3.1), new BigNumber(3.1).isEqualTo('3.100000'));
    let { onMousedown } = useSliderHandler(props, ctx);

    return {
      percentage,
      sliderHandlerLeft,

      onMousedown
    };
  }
});
</script>
