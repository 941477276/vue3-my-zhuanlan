<template>
  <aside class="aside-menu">
    <div class="header-search-box">
      <bs-input class="header-search-input" placeholder="搜索文档..."></bs-input>
    </div>
    <div class="aside-menu-container">
      <bs-menu mode="vertical">
        <bs-menu-item-group key-index="tongyong" title="通用">
          <bs-menu-item key-index="button">按钮</bs-menu-item>
          <bs-menu-item key-index="icon">Icon图标</bs-menu-item>
        </bs-menu-item-group>
        <bs-menu-item-group key-index="data-input" title="数据录入">
          <bs-menu-item key-index="input">输入框</bs-menu-item>
          <bs-menu-item key-index="select">选择器</bs-menu-item>
          <bs-menu-item key-index="checkbox">复选框</bs-menu-item>
          <bs-menu-item key-index="radio">单选框</bs-menu-item>
        </bs-menu-item-group>
      </bs-menu>
    </div>
  </aside>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'AsideMenu'
});
</script>

<style lang="scss">
@import "aside-menu";
</style>
