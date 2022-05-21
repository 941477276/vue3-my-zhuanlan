<template>
<div
  ref="sliderRef"
  class="bs-slider"
  :class="{
    'bs-slider-disabled': disabled,
    'bs-slider-vertical': vertical,
    'has-masks': hasMasks
  }">
  <div
    class="bs-slider-rail"
    @click="handleSliderRailClick">
    <div
      class="bs-slider-track"
      :style="trackStyle"></div>
    <div class="bs-slider-step">
      <div class="bs-slider-dot"></div>
      <div class="bs-slider-dot" :style="`${vertical ? 'top' : 'left'}: 25%`" :data-percentage="25"></div>
      <div class="bs-slider-dot" :style="`${vertical ? 'top' : 'left'}: 65%`" :data-percentage="65"></div>
      <div class="bs-slider-dot" :style="`${vertical ? 'top' : 'left'}: 100%`" :data-percentage="100"></div>
    </div>
    <BsSliderHandler
      ref="sliderHandler1Ref"
      v-bind="$props"
      class="bs-slider-handler-1"
      :slider-ref="sliderRef"
      :model-value="value1"
      :precision="precision"
      @update:modelValue="setValue1"></BsSliderHandler>

    <BsSliderHandler
      ref="sliderHandler2Ref"
      v-if="range"
      v-bind="$props"
      class="bs-slider-handler-2"
      :slider-ref="sliderRef"
      :model-value="value2"
      :precision="precision"
      @update:modelValue="setValue2"></BsSliderHandler>
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
import { useSlider } from './useSlider';
import { useSliderRail } from './useSliderRail';

export default defineComponent({
  name: 'BsSlider',
  components: {
    BsSliderHandler
  },
  props: bsSliderProps,
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let sliderRef = ref<HTMLElement|null>(null);
    let sliderHandler1Ref = ref<HTMLElement|null>(null);
    let sliderHandler2Ref = ref<HTMLElement|null>(null);
    // 判断是否传递了masks
    let hasMasks = computed(function () {
      return props.marks && Object.keys(props.marks).length > 0;
    });
    // let tooltipContent = computed(function ())

    let value1 = ref(0);
    let value2 = ref(0);
    watch(() => props.modelValue, function (newModelValue) {
      console.log('newModelValue', newModelValue);
      if (props.range) {
        value1.value = newModelValue[0];
        value2.value = newModelValue[1];
      } else {
        value1.value = newModelValue;
      }
    }, { immediate: true });

    let { precision, percentage, trackStyle, setValue1, setValue2 } = useSlider(props, ctx, value1, value2);
    let { handleSliderRailClick } = useSliderRail(value1, value2, setValue1, setValue2, props, sliderRef, precision, sliderHandler1Ref, sliderHandler2Ref);

    return {
      sliderRef,
      sliderHandler1Ref,
      sliderHandler2Ref,
      hasMasks,
      percentage,
      trackStyle,
      value1,
      value2,
      precision,

      setValue1,
      setValue2,
      handleSliderRailClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-slider";
</style>
