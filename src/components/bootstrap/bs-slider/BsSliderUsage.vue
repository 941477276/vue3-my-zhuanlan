<template>
<div class="component-usage">
  <div>
    <h3>基本使用</h3>
    <div class="max-w-600">
      <BsSlider v-model="slider1" :min="3" :max="93" :tooltip-formatter="(val) => { return '当前值为：' + val;}"></BsSlider>
    </div>
  </div>
  <!--<div>
    <h3>禁用</h3>
    <BsSlider disabled></BsSlider>
  </div>-->
  <div>
    <hr>
    <h3>垂直模式</h3>
    <div>
      <BsSlider style="float: left" vertical v-model="slider2"></BsSlider>
      <BsSlider style="float: right" vertical v-model="slider2"></BsSlider>
      <div style="clear: both;"></div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';

export default defineComponent({
  name: 'BsSliderUsage',
  components: {},
  setup (props: any) {
    let slider1 = ref(23);
    let slider2 = ref(10);
    return {
      slider1,
      slider2
    };
  }
});
</script>

<style lang="scss" scoped>
.max-w-600{
  max-width: 600px;
}
.component-usage{
  padding-top: 300px;
  //max-width: 600px;
  min-height: 1200px;
}
</style>
