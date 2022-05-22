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

  <div>
    <hr>
    <h3>显示间断点（step=10）</h3>
    <div class="max-w-600">
      <BsSlider
        :show-steps="true"
        :step="10"
        v-model="slider6"></BsSlider>
    </div>
    <h3>垂直模式</h3>
    <div class="max-w-600">
      <BsSlider
        :show-steps="true"
        :step="10"
        :vertical="true"
        v-model="slider6"></BsSlider>
    </div>
  </div>

  <div>
    <hr>
    <h3>显示标记</h3>
    <div class="max-w-600">
      <BsSlider
        :marks="marks"
        v-model="slider7"></BsSlider>
    </div>
    <h3>显示标记（included=false）</h3>
    <div class="max-w-600">
      <BsSlider
        :marks="marks"
        :included="false"
        v-model="slider7"></BsSlider>
    </div>
    <h3>显示标记（区间）</h3>
    <div class="max-w-600">
      <BsSlider
        :marks="marks"
        range
        v-model="slider8"></BsSlider>
    </div>
    <h3>显示标记（区间——垂直模式</h3>
    <div class="max-w-600">
      <BsSlider
        style="height: 500px"
        :marks="marks"
        range
        vertical
        v-model="slider8"></BsSlider>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  h
} from 'vue';
import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';

export default defineComponent({
  name: 'BsSliderUsage',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    BsIcon
  },
  setup (props: any) {
    let slider1 = ref(23);
    let slider2 = ref(10);
    let slider3 = ref([5, 20]);
    let slider4 = ref([15, 43]);
    let slider5 = ref([15, 40]);
    let slider6 = ref(0);
    let slider7 = ref(15);
    let slider8 = ref([20, 35]);

    let marks = ref({
      0: '0°C',
      24: '24°C',
      30: {
        label: '30°C',
        style: {
          color: '#ffe584'
        }
      },
      50: '50°C',
      100: {
        // label: '100°C',
        label: h('span', [h(BsIcon, { name: 'info-circle-fill' }), '100°C']),
        style: {
          color: '#f00',
          fontWeight: 'bold'
        }
      }
    });
    return {
      slider1,
      slider2,
      slider3,
      slider4,
      slider5,
      slider6,
      slider7,
      slider8,
      marks
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
