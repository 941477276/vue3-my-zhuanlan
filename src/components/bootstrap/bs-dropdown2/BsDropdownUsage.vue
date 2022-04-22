<template>
  <div class="component-usage">
    <h3 style="margin-top: 100px">向下</h3>
    <bs-dropdown>
      <bs-button class="dropdown-toggle" type="primary">使用</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>下拉框1</bs-dropdown-item>
        <bs-dropdown-item>下拉框2</bs-dropdown-item>
        <bs-dropdown-item>下拉框3</bs-dropdown-item>
      </template>
    </bs-dropdown>

    <div class="text-right">
      <bs-dropdown>
        <bs-button class="dropdown-toggle" type="primary">使用</bs-button>
        <template #dropdown-item>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </div>

    <hr>
    <h3>向上</h3>
    <bs-dropdown direction="top" :try-all-direction="true">
      <bs-button type="primary">使用2</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>下拉框1</bs-dropdown-item>
        <bs-dropdown-item>下拉框2</bs-dropdown-item>
        <bs-dropdown-item>下拉框3</bs-dropdown-item>
      </template>
    </bs-dropdown>

    <hr>
    <h3>向左</h3>
    <bs-dropdown direction="left">
      <bs-button type="primary">使用2</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>下拉框1</bs-dropdown-item>
        <bs-dropdown-item>下拉框2</bs-dropdown-item>
        <bs-dropdown-item>下拉框3</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <bs-dropdown direction="left" style="margin-left: 200px">
      <bs-button type="primary">使用2</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>下拉框1</bs-dropdown-item>
        <bs-dropdown-item>下拉框2</bs-dropdown-item>
        <bs-dropdown-item>下拉框3</bs-dropdown-item>
      </template>
    </bs-dropdown>

    <hr>
    <h3>向右</h3>
    <bs-dropdown direction="right">
      <bs-button type="primary">使用2</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>下拉框1</bs-dropdown-item>
        <bs-dropdown-item>下拉框2</bs-dropdown-item>
        <bs-dropdown-item>下拉框3</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <bs-dropdown direction="right" style="margin-left: 200px">
      <bs-button type="primary">使用2</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>下拉框1</bs-dropdown-item>
        <bs-dropdown-item>下拉框2</bs-dropdown-item>
        <bs-dropdown-item>下拉框3</bs-dropdown-item>
      </template>
    </bs-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BsDropdownUsage',
  components: {},

  setup (props: any) {
    return {

    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  height: 2000px;
}
h3{
  margin-bottom: 0.8rem;
  margin-top: 5rem;
}
</style>
