<docs>

---
order: 0
title:
  zh-CN: 弹出位置
  en-US: Placements
description: 
  zh-CN: 
    `bs-dropdown`组件共有`top`、`topRight`、`bottom`、`bottomRight`、`left`、`leftBottom`、`right`、`rightBottom`8个弹窗位置。
    并它们可以根据下拉内容和视口宽高自行调整至最佳弹出位置
  en-US: 
    The `bs-dropdown` component has a total of `top`, `topRight`, `bottom`, `bottomRight`, `left`, `leftBottom`, `right`, `rightBottom` 8 pop-up positions.
    And they can adjust themselves to the best pop-up position according to the drop-down content and viewport width and height
---
</docs>

<template>
  <div>
    <div>
      <bs-dropdown
        v-for="placement in vertical"
        :key="placement"
        :placement="placement"
        :show-toggle-arrow="false">
        <bs-button type="primary">{{ placement }}</bs-button>
        <template #content>
          <bs-dropdown-item>Html</bs-dropdown-item>
          <bs-dropdown-item>Css</bs-dropdown-item>
          <bs-dropdown-item active>Javascript</bs-dropdown-item>
          <bs-dropdown-item divider>Vue</bs-dropdown-item>
          <bs-dropdown-item disabled>Angular</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </div>

    <div>
      <bs-dropdown
        v-for="placement in horizontal"
        :key="placement"
        :placement="placement"
        :show-toggle-arrow="false">
        <bs-button type="primary">{{ placement }}</bs-button>
        <template #content>
          <bs-dropdown-item>Html</bs-dropdown-item>
          <bs-dropdown-item>Css</bs-dropdown-item>
          <bs-dropdown-item active>Javascript</bs-dropdown-item>
          <bs-dropdown-item divider>Vue</bs-dropdown-item>
          <bs-dropdown-item disabled>Angular</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let vertical = ref(['top', 'topEnd', 'bottom', 'bottomEnd']);
let horizontal = ref(['left', 'leftEnd', 'right', 'rightEnd']);
</script>

<style lang="scss" scoped>
.bs-dropdown{
  margin: 0 1rem 1rem 0;
}
</style>
