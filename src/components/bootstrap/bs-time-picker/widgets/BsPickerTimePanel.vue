<template>
  <div class="bs-picker-time-panel">
    <div class="bs-picker-header"></div>
    <div
      class="bs-picker-body">
      <div
        class="bs-picker-content"
        :class="{
          'has-periods-column': use12Hour
        }">
        <BsTimeUnitColumn
          v-if="columnsShow.hour"
          :units="hours"
          :value="timeUnitValues.hour"
          :parent-visible="parentVisible"
          :hide-disabled-options="hideDisabledOptions"
          @select="onSelect('hour', $event)"
          key="hour"></BsTimeUnitColumn>
        <BsTimeUnitColumn
          v-if="columnsShow.minute"
          :units="minutes"
          :value="timeUnitValues.minute"
          :parent-visible="parentVisible"
          :hide-disabled-options="hideDisabledOptions"
          @select="onSelect('minute', $event)"
          key="minute"></BsTimeUnitColumn>
        <BsTimeUnitColumn
          v-if="columnsShow.second"
          :units="seconds"
          :value="timeUnitValues.second"
          :parent-visible="parentVisible"
          :hide-disabled-options="hideDisabledOptions"
          @select="onSelect('second', $event)"
          key="second"></BsTimeUnitColumn>
        <BsTimeUnitColumn
          class="bs-picker-time-panel-column-periods"
          v-if="use12Hour"
          :units="periods"
          :value="periodValue"
          :parent-visible="parentVisible"
          @select="onSelect('period', $event)"
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
  watch,
  defineComponent
} from 'vue';
import dayjs from 'dayjs';
import { TimeDataUnit } from '@/ts-tokens/bootstrap/time-picker';
import { bsPickerTimePanelProps } from './bs-picker-time-panel-props';
import { useTimePicker, getUpdateModelValue } from '../useTimePicker';

const calcTimeUnit = function (count = 60, step = 1, use12Hours: boolean, disabledFn: any, disabledFnData: any[]) {
  let arr: TimeDataUnit[] = [];
  step = Math.floor(step);
  step = step < 1 ? 1 : step;
  count = Math.floor(count / step);
  let index = 0;
  while (index < count) {
    let label = index < 10 ? ('0' + index) : index + '';
    let value = index;
    let disabled = false;
    if (typeof disabledFn === 'function') {
      let flag = disabledFn(...disabledFnData, value, use12Hours);
      if (typeof flag === 'boolean') {
        disabled = flag;
      }
    }
    arr.push({
      label,
      value,
      disabled
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
    ...bsPickerTimePanelProps,
    parentVisible: { // 父组件是否可见
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props: any, ctx: any) {
    let {
      formatInner,
      timeUnitValues,
      periods,
      periodValue
    } = useTimePicker(props);

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
      let disabledHoursFn = props.disabledHours;
      while (index < count) {
        let label = index < 10 ? ('0' + index) : index + '';
        let value = index;
        let disabled = false;
        if (use12Hour && index === 0) {
          label = '12';
          value = 12;
        }
        if (typeof disabledHoursFn === 'function') {
          let flag = disabledHoursFn(value, use12Hour);
          if (typeof flag === 'boolean') {
            disabled = flag;
          }
        }
        arr.push({
          label,
          value,
          disabled
        });
        index++;
      }

      return arr;
    });
    let minutes = computed(function () {
      let hour = timeUnitValues.value.hour;
      return calcTimeUnit(60, props.minuteStep, props.use12Hour, props.disabledMinutes, [hour]);
    });
    let seconds = computed(function () {
      let hour = timeUnitValues.value.hour;
      let minute = timeUnitValues.value.minute;
      return calcTimeUnit(60, props.secondStep, props.use12Hour, props.disabledSeconds, [hour, minute]);
    });
    // 计算时分秒的显示与隐藏
    let columnsShow = computed(function () {
      let format = formatInner.value;
      format = format.toLowerCase();
      let result = {
        hour: format.includes('h'),
        minute: format.includes('m'),
        second: format.includes('s')
      };
      return result;
    });
    let onSelect = function (type: string, timeData: TimeDataUnit) {
      let value = {
        ...timeUnitValues.value
      };
      if (type !== 'period') {
        (value as any)[type] = timeData.value;
      } else {
        periodValue.value = timeData.value + '';
      }

      let newModelValue = getUpdateModelValue(props, null, periodValue.value, value);
      ctx.emit('update:modelValue', newModelValue);
    };
    // 将值设为此刻
    let setNow = function () {
      // console.log('BsPickerTimePanel setNow');
      let nowDate = new Date();
      let period = nowDate.getHours() > 12 ? 'pm' : 'am';
      let newModelValue = getUpdateModelValue(props, nowDate, period, null);
      ctx.emit('update:modelValue', newModelValue);
    };

    console.log('valid', dayjs('18:36:33', 'HH:mm:ss'));

    return {
      hours,
      minutes,
      seconds,
      periods,
      columnsShow,
      timeUnitValues,
      periodValue,

      onSelect,
      setNow
    };
  }
});
</script>

<style lang="scss">
@import "bs-picker-time-panel";
</style>
