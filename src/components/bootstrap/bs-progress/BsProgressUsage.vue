<template>
<div class="component-usage">
 <h3>基础用法</h3>
 <div>
   <bs-progress
    v-for="(type, index) in types"
    :color-type="type"
    :key="type"
    :percentage="(index + 1) * 10"></bs-progress>
 </div>

  <hr>
  <h3>条纹进度条</h3>
  <div>
    <bs-progress
      color-type="primary"
      striped
      :percentage="45"
      :text-format="calcText"></bs-progress>
    <bs-progress
      color-type="success"
      striped
      percentage="45"></bs-progress>
    <bs-progress
      color-type="danger"
      striped
      percentage="45%"></bs-progress>
  </div>

  <hr>
  <h3>多个进度条</h3>
  <div>
    <bs-progress
      multiple
      :progresses="progresses"></bs-progress>
  </div>

  <hr>
  <h3>自定义颜色</h3>
  <div>
    <bs-progress
      :percentage="customColorProgressPercentage"
      color="#f60"></bs-progress>
    <bs-progress
      :percentage="customColorProgressPercentage"
      :color="customColorFn"></bs-progress>
    <bs-progress
      :percentage="customColorProgressPercentage"
      :color="customColors"></bs-progress>
    <bs-button @click="handlePercentage(-1)" type="primary">减</bs-button>
    <bs-button @click="handlePercentage(1)" type="primary" style="margin-left: 0.5rem;">加</bs-button>
  </div>

  <hr>
  <h3>自定义内容</h3>
  <div>
    <bs-progress
      :percentage="customColorProgressPercentage"
      style="height: 1.5rem;"
      color-type="warning">
      <template #default="data">
        <bs-icon name="info-circle-fill"></bs-icon>
        进度为：{{ data.percentage }}%
      </template>
    </bs-progress>
    <bs-button @click="handlePercentage(-1)" type="primary">减</bs-button>
    <bs-button @click="handlePercentage(1)" type="primary" style="margin-left: 0.5rem;">加</bs-button>
  </div>

  <hr>
  <h3>条纹动画</h3>
  <div>
    <bs-progress
      color-type="primary"
      striped
      animated
      :percentage="45"></bs-progress>
    <bs-progress
      color-type="success"
      striped
      animated
      :percentage="45"></bs-progress>
    <bs-progress
      color-type="danger"
      striped
      animated
      :percentage="45"></bs-progress>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsTagUsage',
  components: {},

  setup (props: any) {
    let types = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    let progresses = ref([
      {
        percentage: 20,
        colorType: 'primary'
      },
      {
        percentage: 24,
        colorType: 'success',
        striped: true
      },
      {
        percentage: 16,
        colorType: 'warning'
      },
      {
        percentage: 40,
        colorType: 'info',
        striped: true,
        animated: true
      }
    ]);

    let calcText = function (percentage: number) {
      return `当前进度：${percentage}%`;
    };

    let customColorProgressPercentage = ref(20);
    let handlePercentage = function (type: number) {
      let val = 0;
      if (type == -1) {
        val = customColorProgressPercentage.value - 20;
      } else {
        val = customColorProgressPercentage.value + 20;
      }
      if (val < 0) {
        val = 0;
      } else if (val > 100) {
        val = 100;
      }
      customColorProgressPercentage.value = val;
    };
    let customColorFn = function (percentage: number) {
      if (percentage <= 20) {
        return '#f00';
      }
      if (percentage <= 60) {
        return '#ffc107';
      }
      if (percentage <= 80) {
        return '#17a2b8';
      }
      return '#28a745';
    };
    const customColors = [
      { color: '#f56c6c', percentage: 20 },
      { color: '#e6a23c', percentage: 40 },
      { color: '#5cb87a', percentage: 60 },
      { color: '#1989fa', percentage: 80 },
      { color: '#6f7ad3', percentage: 100 }
    ];

    return {
      types,
      progresses,
      customColorProgressPercentage,

      calcText,
      handlePercentage,
      customColorFn,
      customColors
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-progress{
  margin-bottom: 1rem;
}
</style>
