<template>
<div class="component-usage">
  <h3>默认绑定</h3>
  <bs-checkbox v-model="checkboxVal">复选框1</bs-checkbox>
  <bs-checkbox v-model="checkboxVal">复选框2</bs-checkbox>
  <hr>
  <h3>有trueValue属性</h3>
  <bs-checkbox v-model="checkboxVal3" checked :true-value="1" :false-value="0">小学</bs-checkbox>
  <bs-checkbox v-model="checkboxVal3" :true-value="2" :false-value="0">中学</bs-checkbox>
  <bs-checkbox v-model="checkboxVal3" :true-value="3" :false-value="0">高中</bs-checkbox>
  <hr>
  <h3>复选框有值</h3>
  <bs-checkbox v-model="checkboxVal2" checked value="yuwen">语文</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" value="shuxue">数学</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" value="yingyu">英语</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" disabled value="tiyu">体育</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" value="wuli">物理</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2"  readonly value="shengwu">生物</bs-checkbox>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BsCheckboxUsage',
  setup (props: any) {
    let checkboxVal = ref('');
    let checkboxVal2 = ref([]);
    let checkboxVal3 = ref(1);
    return {
      checkboxVal,
      checkboxVal2,
      checkboxVal3
    };
  }
});
</script>

<style scoped>

</style>
