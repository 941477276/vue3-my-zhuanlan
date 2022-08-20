<template>
  <div class="component-usage">
    <a-space direction="vertical" :size="12" style="margin-top: 2rem;">
      <a-date-picker
        v-model:value="value1"
        value-format="YYYY-MM-DD"
        :disabledDate="disabledDate"
        :date-render="dateRender"/>
      <a-date-picker v-model:value="value2" picker="week" />
      <a-date-picker v-model:value="value3" picker="month" />
      <a-date-picker v-model:value="value4" picker="quarter" data-value-format="YYYY-[Q]Q" />
      <a-date-picker v-model:value="value5" picker="year" />
    </a-space>
    <div>
      <h3>基本使用</h3>
      <BsDatePicker name="startDate" v-model="date1"></BsDatePicker>
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
          {{ cell.current.date() }}<small style="color: #f60;margin-left: 2px; opacity: 0.6;">cn</small>
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
      <h3>选择月份</h3>
      <BsDatePicker
        v-model="date3"
        picker-type="month"
        :disabled-date="(date) => {return date.month() < 7}"></BsDatePicker>
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
  </div>
</template>

<script lang="ts">
import {
  ref,
  h,
  defineComponent
} from 'vue';
import BsDatePicker from './BsDatePicker.vue';
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
    let date2 = ref();
    let date3 = ref();
    let quarterDate = ref();
    let quarterDate2 = ref('2022-Q3');

    console.log('quarter date', dayjs('2022-Q3', 'YYYY-[Q]Q').quarter(2));
    console.log('quarter date', dayjs().month(0).quarter(2));
    return {
      value1: ref<Dayjs>(),
      value2: ref<Dayjs>(),
      value3: ref<Dayjs>(),
      value4: ref<Dayjs>(dayjs()),
      value5: ref<Dayjs>(),

      date1,
      date2,
      date3,
      quarterDate,
      quarterDate2,

      disabledDate,
      dateRender (data: any) {
        // console.log(current, today);
        return data.current.date();
      },
      dateRender2 (current: Dayjs) {
        console.log('current', current);
        return h('div', [
          current.date(),
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
        console.log('disabledDate2', current);
        return (current.valueOf() < now.valueOf()) || (current.endOf('month').valueOf() > now.endOf('month').valueOf());
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
