<template>
  <div class="bs-picker-time-panel">
    <div class="bs-picker-header"></div>
    <div class="bs-picker-body">
      <div class="bs-picker-content">
        <BsTimeUnitColumn
          v-if="columnsShow.hour"
          :units="hours"
          :value="timeUnitValues.hour"
          @select="onSelect('hour', $event)"
          key="hour"></BsTimeUnitColumn>
        <BsTimeUnitColumn
          v-if="columnsShow.minute"
          :units="minutes"
          :value="timeUnitValues.minute"
          @select="onSelect('minute', $event)"
          key="minute"></BsTimeUnitColumn>
        <BsTimeUnitColumn
          v-if="columnsShow.second"
          :units="seconds"
          :value="timeUnitValues.second"
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
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeDataUnit } from '@/ts-tokens/bootstrap/time-picker';
import { bsPickerTimePanelProps } from './bs-picker-time-panel-props';

dayjs.extend(customParseFormat);
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
    ...bsPickerTimePanelProps
  },
  emits: ['update:modelValue'],
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
    // 计算时分秒的显示与隐藏
    let columnsShow = computed(function () {
      let format = props.format || 'HH:mm:ss';
      let result = {
        hour: format.includes('H:') || format.includes(':H'),
        minute: format.includes(':m') || format.includes('m:'),
        second: format.includes(':s') || format.includes('s:')
      };
      return result;
    });
    let timeUnitValues = computed(function () {
      let modelValue = props.modelValue;
      let format = props.format;
      let dayIns: Dayjs;
      let result = {
        hour: '',
        minute: '',
        second: ''
      };
      if (!modelValue) {
        return result;
      }

      if (typeof modelValue === 'string') {
        dayIns = dayjs(modelValue, format);
      } else {
        dayIns = dayjs(modelValue);
      }

      return {
        hour: dayIns.hour(),
        minute: dayIns.minute(),
        second: dayIns.second()
      };
    });

    /* let getDayObj = function () {
      let valueFormat = props.valueFormat;
      let { hour, minute, second } = timeUnitValues.value;
      let dayIns: Dayjs;
      if (!valueFormat) {
        dayIns = dayjs(`${hour}:${minute}:${second}`);
      } else {
        dayIns = dayjs(`${hour}:${minute}:${second}`, valueFormat);
      }
      return dayIns;
    }; */

    let onSelect = function (type: string, timeData: TimeDataUnit) {
      let valueFormat = props.valueFormat;
      let value = {
        ...timeUnitValues.value
      };
      (value as any)[type] = timeData.value;
      let dayIns: Dayjs;
      console.log(`${type}选择了：`, timeData, `${value.hour}:${value.minute}:${value.second}`);
      if (!valueFormat) {
        let date = new Date();
        dayIns = dayjs(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${value.hour}:${value.minute}:${value.second}`);
        ctx.emit('update:modelValue', dayIns);
      } else {
        dayIns = dayjs(`${value.hour}:${value.minute}:${value.second}`);
        ctx.emit('update:modelValue', dayIns.format(valueFormat));
      }
    };
    let day = dayjs(new Date());
    console.log('day', day, day.hour());
    return {
      hours,
      minutes,
      seconds,
      columnsShow,
      timeUnitValues,

      onSelect
    };
  }
});
</script>

<style lang="scss">
@import "bs-picker-time-panel";
</style>
