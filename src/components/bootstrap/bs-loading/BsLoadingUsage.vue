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
      <div style="margin-top: 15px;">
        <bs-button type="primary" @click="showLoading">显示Loading</bs-button>
        <bs-button type="primary" @click="hideLoading">隐藏Loading</bs-button>
        <bs-button type="primary" @click="destroyLoading">销毁Loading</bs-button>
        <bs-button type="primary" @click="modifyLoadingText">修改Loading文字</bs-button>
        <bs-button type="primary" @click="setLoadingTextVertical">文字与旋转器垂直对齐</bs-button>
      </div>
    </div>

    <dvi>
      <hr>
      <h3>全局加载（单例的）</h3>
      <bs-button type="primary" @click="showGlobalLoading">显示Loading</bs-button>
      <bs-button type="primary" @click="hideGlobalLoading">隐藏Loading</bs-button>
      <bs-button type="primary" @click="destroyGlobalLoading">销毁Loading</bs-button>
      <bs-button type="primary" @click="modifyGlobalLoadingText">修改Loading文字</bs-button>
    </dvi>

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
  defineComponent,
  toRefs
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
    let obj = toRefs({
      visible: false
    });
    console.log('obj', obj);
    obj.visible.value = true;
    let loading1: any;
    let loading1Vertical = false;
    let globalLoading: any;
    return {
      showLoading () {
        if (!loading1) {
          loading1 = BsLoading({
            text: '加载中...',
            target: '#container1',
            lock: true
          });
        }
        // loading?.show();
        loading1?.updateProps({
          visible: true
        });
        console.log(loading1);
        console.log('------------------');
      },
      hideLoading () {
        if (loading1) {
          loading1?.updateProps({
            visible: false
          });
        }
      },
      destroyLoading () {
        if (loading1) {
          loading1?.destroy();
          loading1 = null;
        }
      },
      modifyLoadingText () {
        if (loading1) {
          loading1?.updateProps({
            text: '动态修改的加载文案！'
          });
        }
      },
      setLoadingTextVertical () {
        if (loading1) {
          loading1?.updateProps({
            vertical: !loading1Vertical
          });
          loading1Vertical = !loading1Vertical;
        }
      },

      showGlobalLoading () {
        if (!globalLoading) {
          globalLoading = BsLoading({
            text: '加载中...',
            fullscreen: true
            // color: '#fff',
            // background: '#f60'
          });
        }
        let globalLoading2 = BsLoading({
          text: '加载中2...',
          fullscreen: true
        });

        console.log('globalLoading', globalLoading);
        console.log('两个全局loading是否相等：', globalLoading === globalLoading2);
        globalLoading?.updateProps({
          visible: true
        });

        setTimeout(function () {
          globalLoading.hide();
        }, 2000);
      },
      hideGlobalLoading () {
        if (globalLoading) {
          globalLoading?.updateProps({
            visible: false
          });
        }
      },
      destroyGlobalLoading () {
        if (globalLoading) {
          globalLoading?.destroy();
          globalLoading = null;
        }
      },
      modifyGlobalLoadingText () {
        if (globalLoading) {
          globalLoading?.updateProps({
            text: '动态修改的加载文案！'
          });
        }
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
 min-height: 1200px;
}
.container1{
  //position: relative;
  max-width: 1200px;
  padding: 1rem;
  height: 100px;
  border: 1px solid #ccc;
  overflow: auto;
}
</style>
