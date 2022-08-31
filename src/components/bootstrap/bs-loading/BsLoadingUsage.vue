<template>
  <div class="component-usage">
    <div>
      <h3>区域加载</h3>
      <div class="container1" id="container1">
        <dl>
          <dt>HTML</dt>
          <dd>HTML的全称为超文本标记语言，是一种标记语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。HTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。</dd>
        </dl>
        <dl>
          <dt>Javascript</dt>
          <dd>JavaScript（简称“JS”） 是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。虽然它是作为开发Web页面的脚本语言而出名，但是它也被用到了很多非浏览器环境中，JavaScript 基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式、声明式、函数式编程范式。</dd>
        </dl>
        <!--<BsLoadingCom text="加载中..."></BsLoadingCom>-->
      </div>
    </div>

    <hr>
    <bs-button type="primary" @click="showLoading">显示Loading</bs-button>

    <bs-button type="primary" @click="addLoading">创建Loading</bs-button>
    <!--<div>
      <h3>success</h3>
      <div class="container1">
        <dl>
          <dt>HTML</dt>
          <dd>HTML的全称为超文本标记语言，是一种标记语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。HTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。</dd>
        </dl>
        <dl>
          <dt>Javascript</dt>
          <dd>JavaScript（简称“JS”） 是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。虽然它是作为开发Web页面的脚本语言而出名，但是它也被用到了很多非浏览器环境中，JavaScript 基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式、声明式、函数式编程范式。</dd>
        </dl>
        <BsLoading color="#fff" background="#f60" text="加载中..."></BsLoading>
      </div>
    </div>-->
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsLoadingCom from './BsLoading.vue';
import { createLoading } from './createLoading';
import { BsLoading } from '@/components/bootstrap/bs-loading/loading';

export default defineComponent({
  name: 'BsLoadingUsage',
  components: {
    // BsLoadingCom
  },
  setup () {
    return {
      showLoading () {
        let loading = BsLoading({
          text: '加载中...',
          target: '#container1'
        });
        loading?.show();
        console.log(loading);
        console.log('------------------');
      },
      addLoading () {
        let loading = createLoading({
          text: '加载中。。。'
        });
        console.log(loading);
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.container1{
  position: relative;
  max-width: 1200px;
  padding: 1rem;
  border: 1px solid #ccc;
}
</style>
