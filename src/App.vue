<template>
  <!--<div class="box">
    <BsButtonUsage></BsButtonUsage>
  </div>-->
  <!--<div class="box">
    <BsInputUsage></BsInputUsage>
  </div>-->
  <!--<div class="box">
    <BsRadioUsage></BsRadioUsage>
  </div>-->
  <div class="box">
    <BsRadioGroupUsage></BsRadioGroupUsage>
  </div>
  <!--<div class="box">
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
  </div>-->

  <!--<div class="box">
    <h3>默认效果</h3>
    <bs-checkbox-group v-model="checkboxGroupVal">
      <bs-checkbox checked value="yuwen">语文</bs-checkbox>
      <bs-checkbox value="shuxue">数学</bs-checkbox>
      <bs-checkbox value="yingyu">英语</bs-checkbox>
      <bs-checkbox disabled value="tiyu">体育</bs-checkbox>
      <bs-checkbox value="wuli">物理</bs-checkbox>
      <bs-checkbox readonly value="shengwu">生物</bs-checkbox>
    </bs-checkbox-group>

    <hr>
    <h3>限制最大选择4个选项</h3>
    <bs-checkbox-group v-model="checkboxGroupVal2" :max="4">
      <bs-checkbox checked value="yuwen">语文</bs-checkbox>
      <bs-checkbox value="shuxue">数学</bs-checkbox>
      <bs-checkbox value="yingyu">英语</bs-checkbox>
      <bs-checkbox value="tiyu">体育</bs-checkbox>
      <bs-checkbox value="wuli">物理</bs-checkbox>
      <bs-checkbox value="shengwu">生物</bs-checkbox>
    </bs-checkbox-group>
  </div>-->
  <!--<bs-input v-model="inputValue" clearable></bs-input>-->
  <!--<div class="box">
    <bs-select v-model="selectVal">
      <bs-option value="1">第1个选项</bs-option>
      <bs-option value="2">第2个选项</bs-option>
      <bs-option-group label="前端语言">
        <bs-option value="html">html</bs-option>
        <bs-option value="javascript">javascript</bs-option>
        <bs-option value="css">css</bs-option>
      </bs-option-group>
    </bs-select>
  </div>-->
  <!--<div class="box">
    <BsFormUsage></BsFormUsage>
  </div>-->
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive } from 'vue';
// import HelloWorld from './components/HelloWorld.vue'
// import AsyncValidatorUsage from './components/AsyncValidatorUsage.vue';
import BsFormUsage from '@/components/bootstrap/bs-form/BsFormUsage.vue';
import BsButtonUsage from '@/components/bootstrap/bs-button/BsButtonUsage.vue';
import BsInputUsage from '@/components/bootstrap/bs-input/BsInputUsage.vue';
import BsRadioUsage from '@/components/bootstrap/bs-radio/BsRadioUsage.vue';
import BsRadioGroupUsage from '@/components/bootstrap/bs-radio-group/BsRadioGroupUsage.vue';

export default defineComponent({
  name: 'App',
  /* eslint-disable */
  components: {
    // HelloWorld
    // AsyncValidatorUsage,
    BsFormUsage,
    BsButtonUsage,
    BsInputUsage,
    BsRadioUsage,
    BsRadioGroupUsage
  },
  setup () {
    let isDisabled = ref(true);

    let radioValBool = ref(null);

    let checkboxVal = ref('');
    let checkboxVal2 = ref([]);
    let checkboxVal3 = ref(1);

    let checkboxGroupVal = ref([]);
    let checkboxGroupVal2 = ref('');

    let selectVal = ref('');

    let show = ref(true);
    setTimeout(function () {
      console.log('隐藏');
      show.value = false;
    }, 1500);

    return {
      isDisabled,
      radioValBool,

      checkboxVal,
      checkboxVal2,
      checkboxVal3,

      checkboxGroupVal,
      checkboxGroupVal2,

      selectVal,

      show

    };
  }
});
</script>

<style lang="scss">
body{
  height: 2000px;
}
.box{
  padding: 20px;
}
</style>
