<template>
<div class="component-usage">
  <h6>默认的</h6>
  <bs-badge>默认的</bs-badge>
  <hr>

  <h6>各种颜色</h6>
  <bs-badge type="primary">primary</bs-badge>
  <bs-badge type="secondary">secondary</bs-badge>
  <bs-badge type="success">success</bs-badge>
  <bs-badge type="danger">danger</bs-badge>
  <bs-badge type="warning">warning</bs-badge>
  <bs-badge type="info">info</bs-badge>
  <bs-badge type="light">light</bs-badge>
  <bs-badge type="dark">dark</bs-badge>
  <hr>

  <h6>胶囊式徽章</h6>
  <bs-badge pill type="primary">primary</bs-badge>
  <bs-badge pill type="secondary">secondary</bs-badge>
  <bs-badge pill type="success">success</bs-badge>
  <bs-badge pill type="danger">danger</bs-badge>
  <bs-badge pill type="warning">warning</bs-badge>
  <bs-badge pill type="info">info</bs-badge>
  <bs-badge pill type="light">light</bs-badge>
  <bs-badge pill type="dark">dark</bs-badge>

  <h6>小园点</h6>
  <bs-badge circle type="primary"></bs-badge>
  <bs-button>
    一个按钮
    <bs-badge circle type="danger"></bs-badge>
  </bs-button>
  <hr>

  <h6>链接</h6>
  <bs-badge tag="a" href="https://www.baidu.com" target="_blank" type="primary">primary</bs-badge>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BsBadgeUsage',
  components: {}

});
</script>

<style lang="scss" scoped>
h6{
  margin: 20px 0 10px 0;
}
.bs-badge{
  margin: 5px 10px;
}
</style>
