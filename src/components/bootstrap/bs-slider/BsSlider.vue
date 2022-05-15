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
    <BsSliderHandler
      v-bind="$props"
      :slider-ref="sliderRef"
      :model-value="value1"
      :precision="precision"
      @update:modelValue="onSliderHandler1Change"></BsSliderHandler>

    <BsSliderHandler
      v-if="range"
      v-bind="$props"
      :slider-ref="sliderRef"
      :model-value="value2"
      :precision="precision"></BsSliderHandler>
  </div>

  <!--<div class="bs-slider-marks">
    <div class="bs-slider-mark-text">0%</div>
    <div class="bs-slider-mark-text" :style="`${vertical ? 'top' : 'left'}: 25%`">25%</div>
    <div class="bs-slider-mark-text" :style="`${vertical ? 'top' : 'left'}: 65%`">65%</div>
    <div class="bs-slider-mark-text" :style="`${vertical ? 'top' : 'left'}: 100%`" :data-percentage="100">100%</div>
  </div>-->
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  unref,
  watch
} from 'vue';
import { bsSliderProps } from './bs-slider-props';
import BsSliderHandler from './widgets/BsSliderHandler.vue';
import { BigNumber } from 'bignumber.js';
import useEvents from './useEvents';

export default defineComponent({
  name: 'BsSlider',
  components: {
    BsSliderHandler
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

    let value1 = ref(0);
    let value2 = ref(0);
    watch(() => props.modelValue, function (newModelValue) {
      if (props.range) {
        value1.value = newModelValue[0];
        value2.value = newModelValue[1];
      } else {
        value1.value = newModelValue;
      }
    }, { immediate: true });

    let onSliderHandler1Change = function (newValue: string|number) {
      console.log('onSliderHandler1Change', newValue);
      let changedValue:string|number|string[]|number[] = newValue;
      if (props.range) {
        let modelValue:string[]|number[] = props.modelValue;
        modelValue[0] = newValue;
        changedValue = modelValue;
      }
      ctx.emit('update:modelValue', changedValue);
      ctx.emit('change', changedValue);
    };

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
    /* watch(() => props.modelValue, function (newValue: number|number[]) {
      if (Array.isArray(newValue)) {
        setValue(...newValue);
      } else {
        setValue(newValue);
      }
    }, { immediate: true }); */
    // 计算百分比
    let percentage = computed<number[]>(function () {
      let min = new BigNumber(props.min);
      let dividend = new BigNumber(props.max).minus(min); // minus减法

      // dividedBy 除法
      let percent1 = (new BigNumber(unref(value1)).minus(min)).dividedBy(dividend).toNumber();
      let percent2 = (new BigNumber(unref(value2)).minus(min)).dividedBy(dividend).toNumber();
      if (percent1 < 0) {
        percent1 = 0;
      }
      if (percent2 > 1) {
        percent2 = 1;
      }

      return [percent1, percent2];
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
    // 精度值
    let precision = computed(function () {
      let arr = [props.min, props.max, props.step];
      if (props.range) {
        arr.push(props.rangeMin || 0);
        arr.push(props.rangeMax || 0);
      }
      let decimalLengthArr = arr.map(valueItem => {
        let decimal = (valueItem + '').split('.')[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, decimalLengthArr);
    });

    return {
      sliderRef,
      hasMasks,
      percentage,
      trackWidth,
      value1,
      value2,
      precision,

      onSliderHandler1Change
    };
  }
});
</script>

<style lang="scss">
@import "bs-slider";
</style>
