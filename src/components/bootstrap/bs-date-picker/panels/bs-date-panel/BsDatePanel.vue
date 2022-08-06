<template>
  <div class="bs-picker-date-panel">
    <PanelHeader></PanelHeader>
    <PanelBody
      :header-cells="tableHeader"
      :body-cells="tableBody"
      :get-cell-text="getCellText"></PanelBody>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  PropType
} from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil } from '@/common/dayjsUtil';
import PanelHeader from '../panel-header/PanelHeader.vue';
import PanelBody from '../panel-body/PanelBody.vue';

const totalCell = 42; // 单元格总数, 6行 * 7天（一周）
const weekDayCount = 7;
let getDates = function (dayjsIns: Dayjs, count: number) {
  let daysDateArr: any = [];
  let dayIndex = 1;
  while (dayIndex <= count) {
    let dayjsInsInner = dayjsUtil.setDate(dayjsIns, dayIndex);
    daysDateArr.push({
      dayjsIns: dayjsInsInner,
      id: dayjsInsInner.format('yyyy-MM-dd')
    });
    dayIndex++;
  }
  return daysDateArr;
};
export default defineComponent({
  name: 'BsDatePanel',
  components: {
    PanelHeader,
    PanelBody
  },
  props: {
    modelValue: {
      type: Object as PropType<Dayjs>,
      default: dayjs('2022-07-01')
    }
  },
  setup (props: any, ctx: any) {
    // 周的第一天
    let weekFirstDay = computed(function () {
      let day = dayjsUtil.locale.firstDayOfWeek('zh-cn');
      return day;
    });
    let tableHeader = computed(function () {
      let weeksName = dayjsUtil.locale.weekdaysMin('zh-cn');
      let firstDayOfWeek = weekFirstDay.value;
      let headers = [];
      for (let i = 0; i < weeksName.length; i++) {
        headers.push({
          // 根据不同国家星期的第一天进行排序
          text: weeksName[(i + firstDayOfWeek) % weekDayCount]
        });
      }
      return headers;
    });
    let tableBody = computed(function () {
      let firstDayOfWeek = weekFirstDay.value;
      let dateArr: any[] = [];
      let modelValue = props.modelValue.clone();
      let year = modelValue?.year();
      let month = modelValue?.month();
      let day = modelValue?.date();
      // 月份的第一天
      let monthFirstDay = modelValue.date(1);
      // 获取月份的第一天为星期几
      let firstDayOfWeekInMonth = monthFirstDay.day();
      // 当前月天数
      let currentMonthDaysCount = dayjsUtil.getMonthDays(year, month);
      // 上一个月天数
      let prevMonthDaysCount = firstDayOfWeekInMonth - firstDayOfWeek;
      // 下一个月天数
      let nextMonthDaysCount = totalCell - currentMonthDaysCount - prevMonthDaysCount;

      console.log('year', year, month, firstDayOfWeekInMonth, currentMonthDaysCount, prevMonthDaysCount, nextMonthDaysCount, firstDayOfWeek);
      let currentMonthDaDays: any[] = getDates(modelValue, currentMonthDaysCount);
      let nextMonthDaDays: any[] = getDates(dayjsUtil.setMonth(modelValue, month + 1), nextMonthDaysCount);
      let prevMonthDays: any[] = [];
      let dayIndex = 0; // 获取当前月份第一天的前一天下标是从0开始的
      while (dayIndex < prevMonthDaysCount) {
        let dayjsIns = dayjsUtil.setDate(modelValue, -dayIndex);
        console.log('上个月：', dayjsIns.format('YYYY-MM-DD'), -dayIndex);
        prevMonthDays.unshift({
          dayjsIns,
          id: dayjsIns.format('yyyy-MM-dd')
        });
        dayIndex++;
      }
      let allDates = [...prevMonthDays, ...currentMonthDaDays, ...nextMonthDaDays];
      // 拆分成2维数组
      while (allDates.length > 0) {
        dateArr.push([...allDates.splice(0, 7)]);
      }
      return dateArr;
    });
    console.log('tableBody', tableBody.value);
    return {
      tableHeader,
      tableBody,
      getCellText (cellData: any) {
        return cellData.dayjsIns.date();
      }
    };
  }
});
</script>

<style lang="scss">

</style>
