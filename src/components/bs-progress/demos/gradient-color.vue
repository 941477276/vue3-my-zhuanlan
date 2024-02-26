<docs>

---
order: 0
title:
  zh-CN: 渐变色
  en-US: Gradient
description:
  zh-CN: 设置`color`属性为对象，可以实现进度条为渐变色效果。
  en-US: Set the `color` property to an object to achieve a gradient color effect for the progress bar.
---
</docs>

<template>
  <div>
    <bs-progress
      type="circle"
      stroke-linecap="round"
      :percentage="65"
      :color="{
        from: '#108ee9',
        to: '#87d068'
      }"></bs-progress>
  </div>
</template>
<style lang="scss" scoped>
.bs-progress{
  margin-bottom: 1rem;
}
</style>
<script setup lang="ts">
</script>
