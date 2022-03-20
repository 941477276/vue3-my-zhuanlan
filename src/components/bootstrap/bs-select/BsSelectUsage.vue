<template>
<div class="component-usage">
  <bs-select v-model="selectVal">
    <bs-option value="1">第1个选项</bs-option>
    <bs-option value="2">第2个选项</bs-option>
    <bs-option-group label="前端语言">
      <bs-option value="html">html</bs-option>
      <bs-option value="javascript">javascript</bs-option>
      <bs-option value="css">css</bs-option>
    </bs-option-group>
  </bs-select>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BsSelectUsage',
  setup (props: any) {
    let selectVal = ref('');
    return {
      selectVal
    };
  }
});
</script>

<style scoped>

</style>
