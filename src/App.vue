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
  <!--<div class="box">
    <BsRadioGroupUsage></BsRadioGroupUsage>
  </div>-->
  <!--<div class="box">
    <BsCheckboxUsage></BsCheckboxUsage>
  </div>-->
  <div class="box">
    <BsCheckboxGroupUsage></BsCheckboxGroupUsage>
  </div>
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
import BsCheckboxUsage from '@/components/bootstrap/bs-checkbox/BsCheckboxUsage.vue';
import BsCheckboxGroupUsage from '@/components/bootstrap/bs-checkbox-group/BsCheckboxGroupUsage.vue';

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
    BsRadioGroupUsage,
    BsCheckboxUsage,
    BsCheckboxGroupUsage
  },
  setup () {
    let isDisabled = ref(true);

    let selectVal = ref('');

    let show = ref(true);
    setTimeout(function () {
      console.log('隐藏');
      show.value = false;
    }, 1500);

    return {
      isDisabled,

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
