<template>
<div class="component-usage">
  <div>
    <h3>基础用法</h3>
    <BsInputNumber></BsInputNumber>
    <hr>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BsInputNumberUsage',
  components: {},

  setup (props: any) {
    let inputValue = ref('哈哈');
    let textareaVal = ref('文本框');
    return {
      inputValue,
      textareaVal
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
