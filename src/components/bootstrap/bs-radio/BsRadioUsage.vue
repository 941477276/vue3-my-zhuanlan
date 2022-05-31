<template>
<div class="component-usage">
  <h2>字符串类型的值</h2>
  <bs-radio class="yuwen-radio" v-model="radioVal" value="yuwen">语文</bs-radio>
  <bs-radio v-model="radioVal" value="shuxue">数学</bs-radio>
  <hr>
  <h2>数字类型的值</h2>
  <bs-radio v-model="radioValNumber" :value="1">男</bs-radio>
  <bs-radio v-model="radioValNumber" :value="2">女</bs-radio>
  <bs-radio v-model="radioValNumber" disabled :value="3">人妖</bs-radio>
  <bs-radio v-model="radioValNumber" :value="4">未知</bs-radio>
  <hr>
  <h2>boolean类型的值</h2>
  <bs-radio v-model="radioVal" :value="true">开启</bs-radio>
  <bs-radio v-model="radioVal" :value="false">关闭</bs-radio>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BsRadioUsage',
  setup (props: any) {
    let radioVal = ref('');
    let radioValNumber = ref(3);
    return {
      radioVal,
      radioValNumber
    };
  }
});
</script>

<style scoped>

</style>
