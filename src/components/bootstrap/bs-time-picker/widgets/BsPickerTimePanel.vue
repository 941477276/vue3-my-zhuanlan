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
        <BsTimeUnitColumn
          class="bs-picker-time-panel-column-periods"
          v-if="use12Hour"
          :units="periods"
          :value="periodValue"
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
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeDataUnit } from '@/ts-tokens/bootstrap/time-picker';
import { bsPickerTimePanelProps } from './bs-picker-time-panel-props';
import { getUpdateModelValue } from '../bsTimePickerUtil';

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
    let viewFormat = computed(function () {
      let format = props.format;
      if (!format) {
        if (props.use12Hour) {
          format = 'h:mm:ss a';
        } else {
          format = 'HH:mm:ss';
        }
      }
      return format;
    });
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
      let format = viewFormat.value;
      format = format.toLowerCase();
      let result = {
        hour: format.includes('h'),
        minute: format.includes('m'),
        second: format.includes('s')
      };
      return result;
    });
    let timeUnitValues = computed(function () {
      let modelValue = props.modelValue;
      let format = viewFormat.value;
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
      let hour = dayIns.hour();
      if (props.use12Hour && hour > 12) {
        hour = hour - 12;
      }
      return {
        hour,
        minute: dayIns.minute(),
        second: dayIns.second()
      };
    });

    // 时段
    let periods = ref([
      { label: 'AM', value: 'am' },
      { label: 'PM', value: 'pm' }
    ]);
    let periodValue = ref('');
    watch(() => props.modelValue, function (modelValue) {
      if (!props.use12Hour) {
        return;
      }
      if (!modelValue) {
        if (!periodValue.value) {
          periodValue.value = 'am';
        } else {
          periodValue.value = '';
        }
        return;
      }
      if (typeof modelValue !== 'string') {
        modelValue = dayjs(modelValue).format(viewFormat.value);
      }
      let periodFlag = modelValue.split(' ')[1];
      if (!periodFlag) {
        return;
      }
      periodFlag = periodFlag.toLowerCase();
      if (periodFlag == 'a') {
        periodFlag = 'am';
      }
      if (periodFlag == 'p') {
        periodFlag = 'pm';
      }
      periodValue.value = periodFlag;
    }, { immediate: true });

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
