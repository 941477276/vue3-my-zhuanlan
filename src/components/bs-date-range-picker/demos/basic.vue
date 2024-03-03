<docs>

---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic usage
description:
  zh-CN: 最简单的用法
  en-US: The simplest usage
---
</docs>

<template>
  <div>
    <BsDateRangePicker v-model="date" data-size="sm" data-format="YYYY年MM月DD日"></BsDateRangePicker>
    <!--<BsDateRangePicker class="aaa-inputer" value-format="YYYY-MM-DD hh:mm:ss" format="YYYY年MM月DD日 hh:mm:ss" clearable picker-type="dateTime" v-model="date" data-size="sm" :default-time="defaultValue" :time-panel-props="timeProps" :disabled-date="setDisabledDate" :dropdown-class="dropdownClass"></BsDateRangePicker>-->
    <!--<BsDateRangePicker class="aaa-inputer" clearable picker-type="month" format="YYYY年MM月" v-model="month" data-size="sm" :disabled-date="setDisabledMonth" :dropdown-class="dropdownClass"></BsDateRangePicker>-->
    <!--<BsDateRangePicker class="aaa-inputer" clearable picker-type="year" v-model="year" data-size="sm" :data-disabled-date="setDisabledMonth" :dropdown-class="dropdownClass"></BsDateRangePicker>-->
    <!--<BsDatePicker v-model="week" picker-type="week" placeholder="请选择周"></BsDatePicker>-->
    <!--<BsDatePicker v-model="month" picker-type="month" placeholder="请选择月份"></BsDatePicker>-->
    <!--<BsDatePicker v-model="quarter" picker-type="quarter" placeholder="请选择季度"></BsDatePicker>-->
    <!--<BsDatePicker v-model="year" picker-type="year" placeholder="请选择年份"></BsDatePicker>-->
    <!--<BsDatePicker v-model="decade" picker-type="decade" placeholder="请选择年份区间"></BsDatePicker>-->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

let date = ref([null, new Date('2023/05/05 12:00:00')]);
// let date2 = ref([new Date('2023/05/05 12:00:00'), new Date('2023/08/15 12:00:00')]);
let week = ref('');
let month = ref(['', '2023-07']);
let quarter = ref('');
let year = ref([]);
let decade = ref('');
let defaultValue = ['09:00:00', '18:30:02'];

/* watch(date, function (dateValue) {
  console.log('选定日期变化了：', dateValue);
  // console.log('格式化后的选定日期：', dateValue[0] && dateValue[0].format('YYYY-MM-DD hh:mm:ss'), dateValue[1] && dateValue[1].format('YYYY-MM-DD hh:mm:ss'));
}); */
// TODO 日期时间选择器bug，只有开始日期或结束日期时选择另一个日期无法选中
let dropdownClass = [
  'aaa',
  ['bb', 'ccc'],
  {
    dd: true,
    ee: false
  }
];

let timeProps = {
  disabledMinutes (hour, minute) {
    console.log('minute', minute);
    return minute > 10 && minute < 20;
  }
};

let setDisabledDate = function (dayjsIns) {
  // console.log('日期：', dayjsIns);
  let day = dayjsIns.date();
  // console.log('当前日期：', day);
  /* if ([3, 5, 11, 16, 20, 28].includes(day)) {
    return true;
  } */
  if (day > 12 && day < 21) {
    return true;
  }
};

let setDisabledMonth = function (dayjsIns) {
  // console.log('setDisabledMonth', dayjsIns);
  let month = dayjsIns.month() + 1;
  // console.log('month', month);
  return [3, 6, 9, 10].includes(month);
};
</script>
'
<style lang="scss" scoped>
.bs-date-editor{
  margin: 0 1rem 1rem 0;
}
</style>
