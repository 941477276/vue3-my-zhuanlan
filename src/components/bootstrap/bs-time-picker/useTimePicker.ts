import { computed, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
export function useTimePicker (props: any) {
  let formatInner = computed(function () {
    let format = props.format;
    if (!format) {
      if (props.use12Hours) {
        format = 'h:mm:ss a';
      } else {
        format = 'HH:mm:ss';
      }
    }
    return format;
  });

  // 根据modeValue解析出时分秒
  let timeUnitValues = computed(function () {
    let modelValue = props.modelValue;
    let format = formatInner.value;
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
    if (props.use12Hours && hour > 12) {
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
  // 时段值
  let periodValue = ref('');
  watch(() => props.modelValue, function (modelValue) {
    if (!props.use12Hours) {
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
      modelValue = dayjs(modelValue).format(formatInner.value);
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

  return {
    formatInner,
    timeUnitValues,
    periods,
    periodValue
  };
};

/**
 * 获取提交给父组件的值
 * @param props props
 * @param dateObj Date对象
 * @param period 时段
 * @param timeUnitValues 时分秒的值
 */
export function getUpdateModelValue (props: any, dateObj: Date|null, period: string, timeUnitValues: any) {
  let valueFormat = props.valueFormat;
  let dayIns: Dayjs;

  let date = dateObj || new Date();
  let hour: number; //  = Number(timeUnitValues.hour);
  let minute: number;
  let second: number;
  if (timeUnitValues) {
    hour = timeUnitValues.hour;
    minute = timeUnitValues.minute;
    second = timeUnitValues.second;
  } else {
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
  }
  if (props.use12Hours) { // 如果是12小时制，则hour需加上12小时
    if (period == 'pm' && hour <= 12) {
      hour += 12;
    } else if (period == 'am' && hour > 12) {
      hour -= 12;
    }
  }
  if (!valueFormat) {
    dayIns = dayjs(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}:${second}`);
    return dayIns;
  } else {
    if (props.use12Hours) {
      let valueFormatArr = valueFormat.split(' ');
      dayIns = dayjs(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}:${second}`);
      // 如果为12小时制，且格式后面有带时间段（如h:mm:ss a），则使用dayjs自身的格式化函数进行格式
      if (valueFormatArr.length === 2) {
        return dayIns.format(valueFormat);
      } else {
        let resultValue = dayIns.format(valueFormat);
        resultValue += ' ' + period;
        return resultValue;
      }
    } else {
      console.log('getUpdateModelValue', 5555, valueFormat);
      dayIns = dayjs(`${hour}:${minute}:${second}`, valueFormat);
      return dayIns.format(valueFormat);
    }
  }
};
