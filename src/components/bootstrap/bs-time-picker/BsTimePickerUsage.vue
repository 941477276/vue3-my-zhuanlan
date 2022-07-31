<template>
  <div class="component-usage">
    <div>
      <h3>AntDesign Time Picker</h3>
      <a-time-picker v-model:value="strValue" />
    </div>
    <div style="margin-top: 1rem;">
      <hr>
      <h3>基本使用</h3>
      <BsTimePicker v-model="time1"></BsTimePicker>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  watch,
  defineComponent
} from 'vue';
import BsTimePicker from './BsTimePicker.vue';
import dayjs, { Dayjs } from 'dayjs';
// import { Dayjs } from 'dayjs';

export default defineComponent({
  name: 'BsTimePickerUsage',
  components: {
    BsTimePicker
  },
  setup () {
    let obj = dayjs('09:00:00', 'HH:mm:ss');
    const strValue = ref<Dayjs>(obj);

    watch(strValue, function (newObj) {
      console.log(obj === newObj, newObj);
    });

    let time1 = ref(new Date());
    return {
      strValue,

      time1
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-date-editor{
  max-width: 200px;
}
</style>
