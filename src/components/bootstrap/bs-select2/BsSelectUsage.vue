<template>
<div class="component-usage">
  <bs-select v-model="selectVal">
    <!--<bs-option-group label="组1">
      <bs-option value="1">第1个选项</bs-option>
      <bs-option value="2">第2个选项</bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
    </bs-option-group>-->
    <bs-option value="1">第1个选项</bs-option>
    <bs-option value="2">第2个选项</bs-option>
    <!--<bs-option-group label="组2">
      <bs-option value="1">第1个选项</bs-option>
      <bs-option value="2">第2个选项</bs-option>
      <bs-option :value="3" label="第3个选项，值为number类型，哈哈"></bs-option>
    </bs-option-group>-->
    <bs-option :value="3">第3个选项，值为number类型</bs-option>
    <bs-option :value="4">第4个选项，值为number类型</bs-option>
    <bs-option value="5" class="is-disabled">禁用项</bs-option>
    <!--<bs-option-group label="组3">
      <bs-option value="1">第1个选项</bs-option>
      <bs-option value="2">第2个选项</bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
    </bs-option-group>-->
  </bs-select>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BsSelectUsage',
  components: {},

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
