<template>
  <div class="component-usage">
    <bs-dropdown>
      <bs-button class="dropdown-toggle" type="primary">使用</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>下拉框1</bs-dropdown-item>
        <bs-dropdown-item>下拉框2</bs-dropdown-item>
        <bs-dropdown-item>下拉框3</bs-dropdown-item>
      </template>
    </bs-dropdown>

    <hr>
    <bs-dropdown>
      <bs-button data-toggle="dropdown" type="primary">使用2</bs-button>
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

<style scoped>

</style>
