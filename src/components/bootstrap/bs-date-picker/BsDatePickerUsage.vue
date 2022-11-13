<template>
  <div class="component-usage">
    <a-space direction="vertical" :size="12" style="margin-top: 2rem;">
      <a-date-picker
        v-model:value="value1"
        value-format="YYYY-MM-DD"
        show-time
        :disabledDate="disabledDate"
        :date-render="dateRender"/>
      <a-date-picker v-model:value="value2" picker="week" />
      <a-date-picker v-model:value="value3" picker="month" />
      <a-date-picker v-model:value="value4" picker="quarter" data-value-format="YYYY-[Q]Q" />
      <a-date-picker v-model:value="value5" picker="year" />
    </a-space>
    <div>
      <h3>基本使用</h3>
      <BsDatePicker name="startDate" v-model="date1">
        <!-- <bs-button>触发按钮</bs-button> -->
      </BsDatePicker>
    </div>

    <div>
      <hr>
      <h3>选择时间</h3>
      <BsDatePicker v-model="date5" picker-type="dateTime"></BsDatePicker>
    </div>

     <div>
      <hr>
      <h3>选择时间（12小时值）</h3>
      <BsDatePicker v-model="date6" picker-type="dateTime" value-format="YYYY-MM-DD hh:mm:ss a" :time-panel-props="{ use12Hours: true, }"></BsDatePicker>
    </div>

    <div>
      <hr>
      <h3>自定义渲染</h3>
      <h6 style="margin: 0.5rem 0;">使用 <code>dateRender</code> 函数</h6>
      <BsDatePicker
        name="startDate"
        v-model="date1"
        :date-render="dateRender2"></BsDatePicker>
      <h6 style="margin: 0.5rem 0;">使用 <code>#dateRender</code> 插槽</h6>
      <BsDatePicker
        name="startDate"
        v-model="date1">
        <template #dateRender="cell">
          {{ cell.dayjsIns.date() }}<small style="color: #f60;margin-left: 2px; opacity: 0.6;">cn</small>
        </template>
      </BsDatePicker>
    </div>

    <div>
      <hr>
      <h3>禁用</h3>
      <BsDatePicker v-model="date2" :disabled-date="disabledDate2"></BsDatePicker>
    </div>

    <div>
      <hr>
      <h3>带快捷按钮</h3>
      <h6>快捷按钮在左边</h6>
      <BsDatePicker v-model="date4" show-sidebar>
        <template #sidebar="{date}">
          <div>
            <bs-button type="">今天{{ date && date.format('YYYY-MM-DD') }}</bs-button>
          </div>
        </template>
      </BsDatePicker>

      <h6 style="margin-top: 1rem;">快捷按钮在右边</h6>
      <BsDatePicker v-model="date4" show-sidebar sidebar-in-right>
        <template #sidebar="{date}">
          <div>
            <bs-button type="">今天{{ date && date.format('YYYY-MM-DD') }}</bs-button>
          </div>
        </template>
      </BsDatePicker>
    </div>

    <div>
      <hr>
      <h3>选择周</h3>
      <BsDatePicker picker-type="week" v-model="week1"></BsDatePicker>
    </div>

    <div>
      <hr>
      <h3>选择周（默认有值）</h3>
      <BsDatePicker picker-type="week" v-model="week2" :disabled-date="disabledWeek"></BsDatePicker>
    </div>

     <div>
      <hr>
      <h3>选择月份</h3>
      <BsDatePicker
        v-model="date3"
        picker-type="month"
        data-disabled-date="(date) => {return date.month() < 7}"></BsDatePicker>
    </div>

    <div>
      <hr>
      <h3>选择季度</h3>
      <BsDatePicker
        v-model="quarterDate"
        picker-type="quarter"></BsDatePicker>
    </div>

   <div>
     <hr>
     <h3>选择季度(默认有值)</h3>
     <BsDatePicker
       v-model="quarterDate2"
       picker-type="quarter"
       value-format="YYYY-[Q]Q"></BsDatePicker>
   </div>

   <div>
     <hr>
     <h3>选择年份</h3>
     <BsDatePicker
       v-model="year"
       picker-type="year"></BsDatePicker>
   </div>

   <div>
     <hr>
     <h3>选择年份(默认有值)</h3>
     <BsDatePicker
       v-model="year2"
       format="YYYY年"
       picker-type="year"
       :disabled-date="disabledYear"></BsDatePicker>
   </div>

   <div>
     <hr>
     <h3>选择年份区间</h3>
     <BsDatePicker
       v-model="decade"
       picker-type="decade"></BsDatePicker>
   </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  h,
  defineComponent
} from 'vue';
import BsDatePicker from './BsDatePicker';
import dayjs, { Dayjs } from 'dayjs';

export default defineComponent({
  name: 'BsDatePickerUsage',
  components: {
    BsDatePicker
  },
  setup () {
    let disabledDate = function (currentDate: Dayjs) {
      let day = currentDate.date();
      // console.log('day', day);
      return day >= 1 && day <= 10;
    };
    let date1 = ref('2022-08-10');
    // let date1 = ref('');
    let date2 = ref();
    let date3 = ref();
    let date4 = ref();
    let date5 = ref();
    let date6 = ref('2022-08-20 19:37:50');
    let quarterDate = ref();
    let quarterDate2 = ref('2022-Q3');

    let year = ref();
    let year2 = ref(dayjs('2024', 'YYYY'));

    let decade = ref();

    let week1 = ref();
    let week2 = ref('2022-29周');

    // console.log('quarter date', dayjs('2022-Q3', 'YYYY-[Q]Q').quarter(2));
    // console.log('quarter date', dayjs().month(0).quarter(2));
    // console.log('year date', dayjs('2022', 'YYYY'));
    // console.log('week date', dayjs('2022-32周', 'YYYY-wo'));
    // console.log('week date2', dayjs('2022-01-01').week(33));
    // console.log('aaAaaaaaa', dayjs('2022-08-20 19:37:50 AM', 'YYYY-MM-DD hh:mm:ss am', true).isValid());
    return {
      value1: ref<Dayjs>(),
      value2: ref<Dayjs>(),
      value3: ref<Dayjs>(),
      value4: ref<Dayjs>(dayjs()),
      value5: ref<Dayjs>(),

      date1,
      date2,
      date3,
      date4,
      date5,
      date6,
      quarterDate,
      quarterDate2,

      year,
      year2,

      decade,

      week1,
      week2,

      disabledDate,
      dateRender (data: any) {
        console.log('data', data);
        return data.current.date();
      },
      dateRender2 (cellData: any) {
        let current = cellData.dayjsIns;
        console.log('cellData', cellData);
        return h('div', [
          current.date?.(),
          h('small', {
            style: {
              color: '#f60',
              marginLeft: '2px',
              opacity: 0.6
            }
          }, 'cn')
        ]);
      },
      disabledDate2 (current: Dayjs) {
        let now = dayjs();
        console.log('current', current);
        // console.log('disabledDate2', current);
        return (current.valueOf() < now.valueOf()) || (current.endOf?.('month').valueOf() > now.endOf('month').valueOf());
      },
      disabledYear (current: Dayjs) {
        let now = new Date().getFullYear();
        // console.log('current111', current);
        return current.year() < now;
      },
      disabledWeek (current: Dayjs) {
        let now = new Date().getTime();
        // console.log('disabledWeek', current);
        return current.valueOf() < now;
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  padding: 2rem 0;
}
</style>
