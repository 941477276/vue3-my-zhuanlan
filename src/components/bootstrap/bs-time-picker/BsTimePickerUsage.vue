<template>
  <div class="component-usage">
    <div>
      <h3>AntDesign Time Picker</h3>
      <a-time-picker v-model:value="strValue" />

      <a-time-picker v-model:value="value" use12-hours value-format="h:mm:ss p" />
      <a-time-picker v-model:value="value" use12-hours value-format="h:mm:ss p" format="h:mm:ss A" style="width: 140px" />
      <!--<a-time-picker v-model:value="value" use12-hours value-format="h:mm:ss A" format="h:mm a" />-->
    </div>
    <div style="margin-top: 1rem;">
      <hr>
      <h3>基本使用</h3>
      <BsTimePicker v-model="time1"></BsTimePicker>
    </div>
    <div>
      <hr>
      <h3>格式化</h3>
      <h6 style="margin: 0.8rem 0">显示格式化</h6>
      <BsTimePicker v-model="time2" format="HH时mm分ss秒"></BsTimePicker>
      <h6 style="margin: 0.8rem 0">值格式化(默认为null，当为null时值为一个 <code>dayjs</code> 实例)</h6>
      <BsTimePicker v-model="time3" value-format="HH时mm分ss秒"></BsTimePicker>
      <p>值：{{ time3 }}</p>
    </div>
    <div>
      <hr>
      <h3 style="margin-bottom: 0.25rem;">选择时分</h3>
      <p> 下拉浮窗中的列会随着 format 变化，当略去 format 中的某部分时，浮层中对应的列也会消失。注意，format 只是改变显示的格式，并非改变 model-value 值。</p>
      <h6 style="margin: 0.8rem 0">只选择时分</h6>
      <BsTimePicker v-model="time4" format="HH:mm"></BsTimePicker>
      <h6 style="margin: 0.8rem 0">只选择分秒</h6>
      <BsTimePicker v-model="time5" format="mm:ss"></BsTimePicker>
    </div>
    <div style="margin-top: 1rem;">
      <hr>
      <h3 style="margin-bottom: 0.25rem;">12小时制</h3>
      <p>12 小时制的时间选择器，默认的 format 为 h:mm:ss a。</p>
      <BsTimePicker v-model="time6" use12-hour value-format="h:mm:ss"></BsTimePicker>
      <p>值：{{ time6 }}</p>
    </div>
    <div style="margin-top: 1rem;">
      <hr>
      <h3>自定义内容</h3>
      <BsTimePicker v-model="time7">
        <bs-button type="primary" plain>由触发的time-picker</bs-button>
      </BsTimePicker>
    </div>
    <div style="margin-top: 1rem;">
      <hr>
      <h3>禁用</h3>
      <BsTimePicker v-model="time7" disabled>
      </BsTimePicker>
    </div>
    <div style="margin-top: 1rem;">
      <hr>
      <h3>显示底部按钮</h3>
      <BsTimePicker v-model="time7" show-footer></BsTimePicker>
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
    let time2 = ref(new Date());
    let time3 = ref('18时02分25秒');
    let time4 = ref(new Date());
    let time5 = ref(new Date());
    let time6 = ref(new Date());
    let time7 = ref(new Date());
    let value = ref(dayjs(new Date()));
    return {
      strValue,

      time1,
      time2,
      time3,
      time4,
      time5,
      time6,
      time7,
      value
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  padding: 1rem 0;
}
.bs-date-editor{
  max-width: 200px;
}
</style>
