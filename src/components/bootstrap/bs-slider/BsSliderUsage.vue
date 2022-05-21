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

  <div>
    <hr>
    <h3>区间</h3>
    <div class="max-w-600">
      <BsSlider range v-model="slider3"></BsSlider>
    </div>
  </div>

  <div>
    <hr>
    <h3>区间值不允许交叉</h3>
    <div class="max-w-600">
      <BsSlider range :enable-cross="false" v-model="slider4"></BsSlider>
    </div>
  </div>

  <div>
    <hr>
    <h3>区间值最小值为5，最大值为8</h3>
    <div class="max-w-600">
      <BsSlider
        range
        :range-min="5"
        :range-max="8"
        :enable-cross="false"
        v-model="slider5"></BsSlider>
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
    let slider3 = ref([5, 20]);
    let slider4 = ref([15, 43]);
    let slider5 = ref([15, 40]);
    return {
      slider1,
      slider2,
      slider3,
      slider4,
      slider5
    };
  }
});
</script>

<style lang="scss" scoped>
.max-w-600{
  max-width: 600px;
}
.component-usage{
  padding-top: 150px;
  //max-width: 600px;
  min-height: 1200px;
}
</style>
