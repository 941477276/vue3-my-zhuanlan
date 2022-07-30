<template>
  <div class="bs-picker-time-panel">
    <div class="bs-picker-header"></div>
    <div class="bs-picker-body">
      <div class="bs-picker-content">
        <BsTimeUnitColumn
          :units="hours"
          @select="onSelect('hour', $event)"
          key="hour"></BsTimeUnitColumn>
        <BsTimeUnitColumn
          :units="minutes"
          @select="onSelect('minute', $event)"
          key="minute"></BsTimeUnitColumn>
        <BsTimeUnitColumn
          :units="seconds"
          @select="onSelect('second', $event)"
          key="second"></BsTimeUnitColumn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BsTimeUnitColumn from './BsTimeUnitColumn.vue';
import {
  ref,
  computed,
  defineComponent
} from 'vue';
import { TimeDataUnit } from '@/ts-tokens/bootstrap/time-picker';

const calcTimeUnit = function (count = 60, step = 1) {
  let arr: TimeDataUnit[] = [];
  step = Math.floor(step);
  step = step < 1 ? 1 : step;
  count = Math.floor(count / step);
  let index = 0;
  while (index < count) {
    let label = index < 10 ? ('0' + index) : index + '';
    let value = index;
    arr.push({
      label,
      value
    });
    index++;
  }

  return arr;
};

export default defineComponent({
  name: 'BsPickerTimePanel',
  components: {
    BsTimeUnitColumn
  },
  props: {
    hourStep: { // 小时选项间隔
      type: Number,
      default: 1
    },
    minuteStep: { // 分钟选项间隔
      type: Number,
      default: 1
    },
    secondStep: { // 秒选项间隔
      type: Number,
      default: 1
    },
    use12Hour: { // 是否使用12小时制
      type: Boolean,
      default: false
    }
  },
  setup (props: any, ctx: any) {
    let hours = computed(function () {
      let arr: TimeDataUnit[] = [];
      let count = 24;
      let use12Hour = props.use12Hour;
      let hourStep = Math.floor(props.hourStep);
      hourStep = hourStep < 1 ? 1 : hourStep;
      if (use12Hour) {
        count = 12;
      }
      count = Math.floor(count / hourStep);
      let index = 0;
      while (index < count) {
        let label = index < 10 ? ('0' + index) : index + '';
        let value = index;
        if (use12Hour && index === 0) {
          label = '12';
          value = 12;
        }
        arr.push({
          label,
          value
        });
        index++;
      }

      return arr;
    });
    let minutes = computed(function () {
      return calcTimeUnit(60, props.minuteStep);
    });
    let seconds = computed(function () {
      return calcTimeUnit(60, props.secondStep);
    });

    let onSelect = function (type: string, timeData: TimeDataUnit) {
      console.log(`${type}选择了：`, timeData);
    };
    return {
      hours,
      minutes,
      seconds,

      onSelect
    };
  }
});
</script>

<style lang="scss">
@import "bs-picker-time-panel";
</style>
