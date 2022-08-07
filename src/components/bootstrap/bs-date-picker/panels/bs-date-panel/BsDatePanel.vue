<template>
  <div class="bs-picker-date-panel">
    <PanelHeader
      :onSuperPrev="onSuperPrev"
      :onPrev="onPrev"
      :onNext="onNext"
      :onSuperNext="onSuperNext">
      <!--TODO 年份按钮在前或在后需要从配置中读取，参照ant-design-vue-->
      <button
        type="button"
        tabindex="-1"
        class="bs-picker-header-year-btn">{{ currentDateInfo.yearName }}</button>
      <button
        type="button"
        tabindex="-1"
        class="bs-picker-header-month-btn">{{ currentDateInfo.monthName }}</button>
    </PanelHeader>
    <PanelBody
      :header-cells="tableHeader"
      :body-cells="tableBody"
      :get-cell-text="getCellText"
      :get-cell-classname="getCellClassname"
      :get-cell-title="getCellTitle"></PanelBody>
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
import { dayjsUtil, isLeapYear, getMonthDays } from '@/common/dayjsUtil';
import PanelHeader from '../panel-header/PanelHeader.vue';
import PanelBody from '../panel-body/PanelBody.vue';

const totalCell = 42; // 单元格总数, 6行 * 7天（一周）
const weekDayCount = 7;
const defaultFormat = 'YYYY-MM-DD';
let getDates = function (dayjsIns: Dayjs, count: number) {
  let daysDateArr: any = [];
  let dayIndex = 1;
  while (dayIndex <= count) {
    let dayjsInsInner = dayjsUtil.setDate(dayjsIns, dayIndex);
    daysDateArr.push({
      dayjsIns: dayjsInsInner,
      id: dayjsInsInner.format(defaultFormat)
    });
    dayIndex++;
  }
  return daysDateArr;
};
/**
 * 获取指定月份面板中上一个月该显示的天数
 * @param date 当前日期
 * @param lang 国籍语言
 */
let getPrevMonthDayCount = function (date: Dayjs, lang:string) {
  // 周的第一天
  let firstDayOfWeek = dayjsUtil.locale.firstDayOfWeek(lang);
  // 月份的第一天
  let monthFirstDay = date.date(1);
  // 获取月份的第一天为星期几
  let firstDayOfWeekInMonth = monthFirstDay.day();
  firstDayOfWeekInMonth = firstDayOfWeekInMonth == 0 ? 7 : firstDayOfWeekInMonth;
  /*
     一周的起点为星期1：
       1号星期1，上一个月天数0 1-1=0
       1号星期2，上一个月天数1 1-2=-1
       1号星期3，上一个月天数2 1-3=-2
       1号星期4，上一个月天数3 1-4=-3
       1号星期5，上一个月天数4 1-5=-4
       1号星期6，上一个月天数5 1-6=-5
       1号星期7，上一个月天数6 1-7=-6
     一周的起点为星期天：
       1号星期1，上一个月天数1 0-1=-1
       1号星期2，上一个月天数2 0-2=-2
       1号星期3，上一个月天数3 0-3=-3
       1号星期4，上一个月天数4 0-4=-4
       1号星期5，上一个月天数5 0-5=-5
       1号星期6，上一个月天数6 0-6=-6
       1号星期7，上一个月天数0 0-7=-7
   */
  // 上一个月天数
  let prevMonthDaysCount = Math.abs(firstDayOfWeek - firstDayOfWeekInMonth);
  // 月份面板中显示的上一个月份天数不能大于等于7天
  prevMonthDaysCount = prevMonthDaysCount >= 7 ? 0 : prevMonthDaysCount;
  console.log('上一个月天数', prevMonthDaysCount, firstDayOfWeekInMonth);
  return prevMonthDaysCount;
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
      default: dayjs('2022-05-05')
    }
  },
  setup (props: any, ctx: any) {
    let date = ref(dayjs(props.modelValue ? props.modelValue : undefined));
    // date.value = dayjs('2022-02-01');
    // 周的第一天
    let weekFirstDay = computed(function () {
      let day = dayjsUtil.locale.firstDayOfWeek('zh-cn');
      return day;
    });
    // 当前日期信息
    let currentDateInfo = computed(function () {
      let currentDate = date.value;
      let year = dayjsUtil.getYear(currentDate);
      let month = dayjsUtil.getMonth(currentDate);
      let day = dayjsUtil.getDate(currentDate);
      let monthNames = dayjsUtil.locale.monthsShort('zh-cn');
      return {
        year,
        // TODO 这里的format需要从语言配置中读取(参照ant-design-vue)
        yearName: dayjsUtil.locale.format(currentDate, 'zh-cn', 'YYYY年'),
        month,
        monthName: monthNames[month],
        day
      };
    });
    // 表头
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
      let currentDate = date.value.clone();
      let year = dayjsUtil.getYear(currentDate);
      let month = dayjsUtil.getMonth(currentDate);
      // let day = dayjsUtil.getDate(currentDate);
      // 月份的第一天
      let monthFirstDay = currentDate.date(1);
      // 获取月份的第一天为星期几
      let firstDayOfWeekInMonth = monthFirstDay.day();
      // 当前月天数
      let currentMonthDaysCount = getMonthDays(year, month);
      /*
         一周的起点为星期1：
           1号星期1，上一个月天数0 1-1=0
           1号星期2，上一个月天数1 1-2=-1
           1号星期3，上一个月天数2 1-3=-2
           1号星期4，上一个月天数3 1-4=-3
           1号星期5，上一个月天数4 1-5=-4
           1号星期6，上一个月天数5 1-6=-5
           1号星期7，上一个月天数6 1-7=-6
         一周的起点为星期天：
           1号星期1，上一个月天数1 0-1=-1
           1号星期2，上一个月天数2 0-2=-2
           1号星期3，上一个月天数3 0-3=-3
           1号星期4，上一个月天数4 0-4=-4
           1号星期5，上一个月天数5 0-5=-5
           1号星期6，上一个月天数6 0-6=-6
           1号星期7，上一个月天数0 0-7=-7
       */
      // 上一个月天数
      // let prevMonthDaysCount = firstDayOfWeekInMonth - firstDayOfWeek;
      let prevMonthDaysCount = getPrevMonthDayCount(currentDate, 'zh-cn');
      // 下一个月天数
      let nextMonthDaysCount = totalCell - currentMonthDaysCount - prevMonthDaysCount;

      console.log('year', year, month, firstDayOfWeekInMonth, currentMonthDaysCount, prevMonthDaysCount, nextMonthDaysCount, firstDayOfWeek);
      let currentMonthDaDays: any[] = getDates(currentDate, currentMonthDaysCount);
      let nextMonthDaDays: any[] = getDates(dayjsUtil.setMonth(currentDate, month + 1), nextMonthDaysCount);
      let prevMonthDays: any[] = [];
      let dayIndex = 0; // 获取当前月份第一天的前一天下标是从0开始的
      while (dayIndex < prevMonthDaysCount) {
        let dayjsIns = dayjsUtil.setDate(currentDate, -dayIndex);
        // console.log('上个月：', dayjsIns.format('YYYY-MM-DD'), -dayIndex);
        prevMonthDays.unshift({
          dayjsIns,
          id: dayjsIns.format(defaultFormat)
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
    // 设置单元格单classname
    let getCellClassname = function (cellData: any, cellIndex: number) {
      let currentDate = date.value;
      let modelValue = props.modelValue;
      let dayjsIns = cellData.dayjsIns;
      let classnames: string[] = [];
      console.log('getCellClassname', currentDate.format(defaultFormat), dayjsIns.format(defaultFormat));
      if (currentDate.format('YYYY-MM') === dayjsIns.format('YYYY-MM')) {
        classnames.push('active-cell');
      }
      if (modelValue && (modelValue.format(defaultFormat) === dayjsIns.format(defaultFormat))) {
        classnames.push('is-selected');
      }
      if (dayjsIns.isToday()) {
        classnames.push('is-today');
      }
      return classnames;
    };
    return {
      currentDateInfo,

      tableHeader,
      tableBody,
      getCellClassname,
      getCellText (cellData: any) {
        return cellData.dayjsIns.date();
      },
      getCellTitle (cellData: any) {
        return cellData.dayjsIns.format(defaultFormat);
      },

      onSuperPrev () {
        console.log('onSuperPrev');
      },
      onPrev () {
        console.log('onPrev');
        date.value = dayjsUtil.addMonth(date.value, -1);
      },
      onNext () {
        console.log('onNext');
        date.value = dayjsUtil.addMonth(date.value, 1);
      },
      onSuperNext () {
        console.log('onSuperNext');
      }
    };
  }
});
</script>

<style lang="scss">

</style>
