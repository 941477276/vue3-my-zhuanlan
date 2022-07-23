<template>
<div class="component-usage">
  <bs-button type="primary" @click="onClick">简单按钮</bs-button>
  <hr>
  <bs-button type="primary" @click="onClick" plain>朴素按钮</bs-button>
  <hr>
  <bs-button type="primary" @click="onClick" round>圆角按钮</bs-button>
  <hr>

  <bs-button type="primary" @click="onClick" size="sm">小按钮</bs-button>
  <hr>

  <bs-button type="primary" @click="onClick" size="lg">大按钮</bs-button>
  <hr>

  <bs-button type="primary" @click="onClick" block>块级按钮</bs-button>
  <hr>

  <bs-button type="primary" @click="onClick" disabled>禁用按钮</bs-button>
  <hr>

  <bs-button type="primary" @click="onClick" loading>加载中按钮</bs-button>

  <hr>
  <bs-button type="link" tag="a" href="https://www.baidu.com" target="_blank">a标签(跳转到百度)</bs-button>
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
