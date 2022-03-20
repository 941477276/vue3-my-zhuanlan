<template>
<div class="component-usage">
  <bs-button @click="onClick">简单按钮</bs-button>
  <hr>
  <bs-button @click="onClick" plain>朴素按钮</bs-button>
  <hr>
  <bs-button @click="onClick" round>圆角按钮</bs-button>
  <hr>

  <bs-button @click="onClick" block>块级按钮</bs-button>
  <hr>

  <bs-button @click="onClick" disabled>禁用按钮</bs-button>
  <hr>

  <bs-button @click="onClick" loading>加载中按钮</bs-button>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BsButtonUsage',
  setup (props: any) {
    let onClick = function (evt: MouseEvent) {
      console.log(evt);
    };
    return {
      onClick
    };
  }
});
</script>

<style scoped>

</style>
