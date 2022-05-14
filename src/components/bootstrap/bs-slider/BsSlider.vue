<template>
<div
  ref="sliderRef"
  class="bs-slider"
  :class="{
    'bs-slider-disabled': disabled,
    'bs-slider-vertical': vertical,
    'has-masks': hasMasks
  }">
  <div class="bs-slider-rail">
    <div
      class="bs-slider-track"
      :style="{
        width: trackWidth + '%',
        left: range ? (percentage[0] + '%') : 0
      }"></div>
    <div class="bs-slider-step">
      <div class="bs-slider-dot"></div>
      <div class="bs-slider-dot" :style="`${vertical ? 'top' : 'left'}: 25%`" :data-percentage="25"></div>
      <div class="bs-slider-dot" :style="`${vertical ? 'top' : 'left'}: 65%`" :data-percentage="65"></div>
      <div class="bs-slider-dot" :style="`${vertical ? 'top' : 'left'}: 100%`" :data-percentage="100"></div>
    </div>
    <BsTooltip
      :transition-name="tooltipTransitionName"
      :popper-class="tooltipClass"
      :placement="tooltipPlacement"
      :disabled="disabled"
      :visible="showToolTip"
      content="123">
      <div
        class="bs-slider-handler bs-slider-handler-1"
        :style="{
          left: (percentage[0] * 100) + '%'
        }"></div>
    </BsTooltip>

    <BsTooltip
      v-if="range"
      :transition-name="tooltipTransitionName"
      :popper-class="tooltipClass"
      :placement="tooltipPlacement"
      :disabled="disabled"
      :visible="showToolTip"
      content="123">
      <div
        class="bs-slider-handler bs-slider-handler-2"
        :style="{
          left: (percentage[1] * 100) + '%'
        }"></div>
    </BsTooltip>
  </div>

  <div class="bs-slider-marks">
    <div class="bs-slider-mark-text">0%</div>
    <div class="bs-slider-mark-text" :style="`${vertical ? 'top' : 'left'}: 25%`">25%</div>
    <div class="bs-slider-mark-text" :style="`${vertical ? 'top' : 'left'}: 65%`">65%</div>
    <div class="bs-slider-mark-text" :style="`${vertical ? 'top' : 'left'}: 100%`" :data-percentage="100">100%</div>
  </div>

  <!--<BsTooltip
    transition-name="scale"
    :popper-class="tooltipClass"
    content="123">
    aa
  </BsTooltip>-->
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch
} from 'vue';
import { bsSliderProps } from './bs-slider-props';
import BsTooltip from '../bs-tooltip/BsTooltip.vue';
import { BigNumber } from 'bignumber.js';

export default defineComponent({
  name: 'BsSlider',
  components: {
    BsTooltip
  },
  props: bsSliderProps,
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let sliderRef = ref<HTMLElement|null>(null);
    // 判断是否传递了masks
    let hasMasks = computed(function () {
      return props.marks && Object.keys(props.marks).length > 0;
    });
    // let tooltipContent = computed(function ())

    let currentValue = ref<number|number[]>(0);
    let setValue = function (value1?: number, value2?: number) {
      let min = props.min;
      let max = props.max;
      if (props.range) {
        let valueArr = currentValue.value as number[];
        let rangeMin = props.rangeMin;
        let value1Changed = true;
        let value2Changed = true;
        let rangeMax = props.rangeMax;
        if (typeof value1 === 'number') {
          if (value1 < min) {
            value1 = min;
          }
          if (typeof rangeMin === 'number' && (value1 as number) < rangeMin) {
            value1 = rangeMin;
          }
          if (value1 == valueArr[0]) {
            value1Changed = false;
          } else {
            valueArr[0] = value1 as number;
          }
        }
        if (typeof value2 === 'number') {
          if (value2 < min) {
            value2 = min;
          }
          if (typeof rangeMax === 'number' && (value2 as number) < rangeMax) {
            value2 = rangeMax;
          }
          if (value2 == valueArr[0]) {
            value2Changed = false;
          } else {
            valueArr[1] = value2 as number;
          }
        }
        if (value1Changed || value2Changed) {
          ctx.emit('update:modelValue', valueArr);
          ctx.emit('change', valueArr);
        }
      } else {
        if ((value1 as number) < min) {
          value1 = min;
        }
        if ((value1 as number) > max) {
          value1 = max;
        }
        if (currentValue.value == value1) {
          return;
        }
        currentValue.value = value1 as number;
        ctx.emit('update:modelValue', value1);
        ctx.emit('change', value1);
      }
    };
    watch(() => props.modelValue, function (newValue: number|number[]) {
      if (Array.isArray(newValue)) {
        setValue(...newValue);
      } else {
        setValue(newValue);
      }
    }, { immediate: true });
    // 计算百分比
    let percentage = computed<number[]>(function () {
      let max = new BigNumber(props.max);
      let result: number[] = [];
      result = (props.range ? (currentValue.value as number[]) : [currentValue.value as number]).map((valueItem: number) => {
        return new BigNumber(valueItem).dividedBy(max).toNumber();
      });
      if (result[0] < 0) {
        result[0] = 0;
      }
      if (result[1] > 1) {
        result[1] = 1;
      }

      return result;
    });
    // 计算高亮轨道的宽度
    let trackWidth = computed(function () {
      let percentageVal = percentage.value;
      if (props.range) {
        return (percentageVal[1] - percentageVal[0]) * 100;
      } else {
        return percentageVal[0] * 100;
      }
    });

    return {
      sliderRef,
      hasMasks,
      percentage,
      trackWidth
    };
  }
});
</script>

<style lang="scss">
@import "bs-slider";
</style>
