<template>
  <div class="component-usage">
    <h1>基础用法</h1>
    <bs-breadcrumb>
      <breadcrumb-item to="/home">Home</breadcrumb-item>
      <breadcrumb-item :to="{path: '/login'}">Library1</breadcrumb-item>
      <breadcrumb-item><a href="baidu.com" target="_blank">Library2</a></breadcrumb-item>
      <breadcrumb-item :disabled="true">Library3</breadcrumb-item>
      <breadcrumb-item>Library4</breadcrumb-item>
      <breadcrumb-item>Library5</breadcrumb-item>
      <breadcrumb-item v-if="show">Library6</breadcrumb-item>
    </bs-breadcrumb>

    <h1>修改分隔符</h1>
    <bs-breadcrumb separator=">">
      <breadcrumb-item to="/home">Home</breadcrumb-item>
      <breadcrumb-item :to="{path: '/login'}">Library1</breadcrumb-item>
      <breadcrumb-item><a href="baidu.com" target="_blank">Library2</a></breadcrumb-item>
      <breadcrumb-item :disabled="true">Library3</breadcrumb-item>
      <breadcrumb-item>Library4</breadcrumb-item>
      <breadcrumb-item>Library5</breadcrumb-item>
      <breadcrumb-item>Library6</breadcrumb-item>
    </bs-breadcrumb>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';
export default defineComponent({
  name: 'BsBreadcrumbUsage',
  components: {},
  setup () {
    let show = ref(true);

    setTimeout(function () {
      show.value = false;
    }, 1500);

    return {
      show
    };
  }
});
</script>

<style lang="scss">

</style>
