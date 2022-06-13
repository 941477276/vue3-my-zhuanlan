<template>
  <div class="component-usage">
    <div class="container">
      <h3>基本使用</h3>
      <div class="row">
        <div class="col-md-6">
          <h5>环状旋转器</h5>
          <bs-spinner></bs-spinner>
        </div>
        <div class="col-md-6">
          <h5>增长式旋转器</h5>
          <bs-spinner grow></bs-spinner>
        </div>
      </div>

      <hr>
      <h3>不同颜色</h3>
      <div class="diff-color">
        <bs-spinner
          v-for="type in colorTypes"
          :key="type"
          :color-type="type"></bs-spinner>
      </div>
      <div class="diff-color">
        <bs-spinner
          v-for="type in colorTypes"
          grow
          :key="type"
          :color-type="type"></bs-spinner>
      </div>

      <hr>
      <h3>与按钮一起使用</h3>
      <div>
        <bs-button type="primary">
          <bs-spinner></bs-spinner>
          提交中...
        </bs-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import { supportedBsColorTypes } from '@/ts-tokens/bootstrap';

export default defineComponent({
  name: 'BsSpinnerUsage',
  setup () {
    let colorTypes = ref([...supportedBsColorTypes]);

    return {
      colorTypes
    };
  }
});
</script>

<style lang="scss" scoped>
.diff-color{
  margin: 1rem;
  .bs-spinner{
    margin-right: 1rem;
  }
}
</style>
