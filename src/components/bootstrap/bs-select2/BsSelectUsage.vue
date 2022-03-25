<template>
<div class="component-usage">
  <h3 style="margin-top: 300px;margin-bottom: 15px;">单选</h3>
  <bs-select v-model="selectVal">
    <bs-option value="a">第1个选项</bs-option>
    <bs-option value="b">第2个选项</bs-option>
    <bs-option :value="3">第3个选项，值为number类型</bs-option>
    <bs-option :value="4">第4个选项，值为number类型</bs-option>
    <bs-option value="5" :disabled="true">禁用项</bs-option>
  </bs-select>

  <h3 style="margin-top: 50px;margin-bottom: 15px;">多选</h3>
  <bs-select
    v-model="selectVals"
    multiple
    :multiple-limit="4"
    @select-limit="onMultipleLimit">
    <bs-option-group label="组1">
      <bs-option value="group-value1">第1个选项</bs-option>
      <bs-option value="group-value2">第2个选项</bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
    </bs-option-group>
    <bs-option value="4">第4个选项</bs-option>
    <bs-option :value="true">第5个选项，值为boolean类型</bs-option>
    <bs-option value="6" :disabled="true">禁用项</bs-option>
    <bs-option-group label="组2">
      <bs-option value="group-value7">第7个选项</bs-option>
      <bs-option value="group-value8" :disabled="true">第8个选项</bs-option>
    </bs-option-group>
    <bs-option-group label="组3（禁用的）" disabled>
      <bs-option value="group-value9">第9个选项</bs-option>
      <bs-option value="group-value10">第10个选项</bs-option>
    </bs-option-group>
  </bs-select>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsSelectUsage',
  components: {},

  setup (props: any) {
    let selectVal = ref('');
    let selectVals = ref([]);

    let onMultipleLimit = function (limitCount: number) {
      alert(`最多只能选择${limitCount}项！`);
    };

    return {
      selectVal,
      selectVals,
      onMultipleLimit
    };
  }
});
</script>

<style scoped>

</style>
