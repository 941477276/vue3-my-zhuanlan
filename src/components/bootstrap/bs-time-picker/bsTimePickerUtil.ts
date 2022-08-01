import dayjs, { Dayjs } from 'dayjs';

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
  if (props.use12Hour) { // 如果是12小时制，则hour需加上12小时
    console.log('hour', hour);
    if (period == 'pm' && hour <= 12) {
      hour += 12;
    } else if (period == 'am' && hour > 12) {
      hour -= 12;
    }
    console.log('hour', hour);
  }
  if (!valueFormat) {
    // let date = new Date();
    dayIns = dayjs(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}:${second}`);
    return dayIns;
  } else {
    if (props.use12Hour) {
      let valueFormatArr = valueFormat.split(' ');
      // let date = new Date();
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
