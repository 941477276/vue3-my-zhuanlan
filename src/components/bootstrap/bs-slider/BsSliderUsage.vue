<template>
<div class="component-usage">
  <div>
    <h3>基本使用</h3>
    <BsSlider v-model="slider1" :min="3" :max="93"></BsSlider>
  </div>
 <!-- <div>
    <h3>禁用</h3>
    <BsSlider disabled></BsSlider>
  </div>
  <div>
    <h3>垂直模式</h3>
    <BsSlider vertical></BsSlider>
    一段文本
  </div>-->
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
    return {
      slider1
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  padding-top: 300px;
  max-width: 600px;
  min-height: 1200px;
}
</style>
