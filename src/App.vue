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
  <!--<div class="box">
    <BsCheckboxGroupUsage></BsCheckboxGroupUsage>
  </div>-->
  <!--<div class="box">
    <BsSelectUsage></BsSelectUsage>
  </div>-->
  <!--<div class="box">
    <BsFormUsage></BsFormUsage>
  </div>-->
  <!--div class="box">
    <BsDropdownUsage></BsDropdownUsage>
  </div>-->
  <!--<router-view></router-view>-->
  <div class="box">
    <BsPaginationUsage></BsPaginationUsage>
  </div>
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
import BsSelectUsage from '@/components/bootstrap/bs-select/BsSelectUsage.vue';
import BsDropdownUsage from '@/components/bootstrap/bs-dropdown/BsDropdownUsage.vue';
import BsPaginationUsage from '@/components/bootstrap/bs-pagination/BsPaginationUsage.vue';

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
    BsCheckboxGroupUsage,
    BsSelectUsage,
    BsDropdownUsage,
    BsPaginationUsage
  },
  setup () {
    return {

    };
  }
});
</script>

<style lang="scss">
/*body{
  height: 2000px;
}*/
.box{
  padding: 20px;
}
</style>
