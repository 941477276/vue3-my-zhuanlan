<template>
  <div class="component-usage">
    <a-space direction="vertical" :size="12">
      <a-date-picker v-model:value="value1" :disabledDate="disabledDate" />
      <a-date-picker v-model:value="value2" picker="week" />
      <a-date-picker v-model:value="value3" picker="month" />
      <a-date-picker v-model:value="value4" picker="quarter" />
      <a-date-picker v-model:value="value5" picker="year" />
    </a-space>
    <div>
      <h3>基本使用</h3>
      <BsDatePicker></BsDatePicker>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import BsDatePicker from './BsDatePicker.vue';
import { Dayjs } from 'dayjs';

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

    return {
      value1: ref<Dayjs>(),
      value2: ref<Dayjs>(),
      value3: ref<Dayjs>(),
      value4: ref<Dayjs>(),
      value5: ref<Dayjs>(),

      disabledDate
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  padding: 2rem 0;
}
</style>
