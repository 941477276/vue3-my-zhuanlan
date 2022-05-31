<template>
<div class="component-usage">
  <h3>默认绑定</h3>
  <bs-checkbox v-model="checkboxVal">复选框1</bs-checkbox>
  <bs-checkbox v-model="checkboxVal">复选框2</bs-checkbox>
  <bs-checkbox></bs-checkbox>
  <hr>
  <h3>有trueValue属性</h3>
  <bs-checkbox v-model="checkboxVal3" checked :true-value="1" :false-value="0">小学</bs-checkbox>
  <bs-checkbox v-model="checkboxVal4" :true-value="2" :false-value="0">中学</bs-checkbox>
  <bs-checkbox v-model="checkboxVal5" :true-value="3" :false-value="0">高中</bs-checkbox>
  <hr>
  <h3>复选框有值</h3>
  <bs-checkbox v-model="checkboxVal2" checked value="yuwen">语文</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" value="shuxue">数学</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" value="yingyu">英语</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" disabled value="tiyu">体育</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2" value="wuli">物理</bs-checkbox>
  <bs-checkbox v-model="checkboxVal2"  readonly value="shengwu">生物</bs-checkbox>
  <hr>
  <h3>禁用</h3>
  <div>
    <bs-checkbox v-model="language" disabled value="Javascript">Javascript</bs-checkbox>
    <bs-checkbox v-model="language" disabled value="Html">Html</bs-checkbox>
    <bs-checkbox v-model="language" value="Css">Css</bs-checkbox>
  </div>
  <hr>
  <h3>不确定状态</h3>
  <div>
    <bs-checkbox id="ideterminate_checkbox" :indeterminate="isIndeterminate" v-model="checkAll">全选</bs-checkbox>
    <br>
    <bs-checkbox v-model="language" value="Javascript">Javascript</bs-checkbox>
    <bs-checkbox v-model="language" value="Html">Html</bs-checkbox>
    <bs-checkbox v-model="language" value="Css">Css</bs-checkbox>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  name: 'BsCheckboxUsage',
  setup (props: any) {
    let checkboxVal = ref('');
    let checkboxVal2 = ref([]);
    let checkboxVal3 = ref(1);
    let checkboxVal4 = ref(0);
    let checkboxVal5 = ref(0);

    let checkAll = ref(false);
    let language = ref(['Javascript']);
    let isIndeterminate = computed(function () {
      // return true;
      return language.value.length != 0 && language.value.length != 3;
    });
    watch(language, function () {
      checkAll.value = language.value.length == 3;
    });
    return {
      checkboxVal,
      checkboxVal2,
      checkboxVal3,
      checkboxVal4,
      checkboxVal5,
      checkAll,
      language,
      isIndeterminate
    };
  }
});
</script>

<style scoped>

</style>
