<template>
<div class="component-usage">
  <div>
    <h3>基本使用</h3>
    <BsSlider :model-value="23"></BsSlider>
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
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsSliderUsage',
  components: {}

});
</script>

<style lang="scss" scoped>
.component-usage{
  max-width: 600px;
}
</style>
