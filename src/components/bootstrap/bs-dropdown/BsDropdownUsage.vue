<template>
  <div class="component-usage">

    <header class="fixed-header">
      <bs-button type="primary" @click="modalVisible = true" style="margin-right: 1rem;">在弹窗中</bs-button>
      <bs-button type="primary" @click="drawerVisible = true" style="margin-right: 1rem;">在抽屉弹窗中</bs-button>
      <bs-button type="primary" @click="modalVisible2 = true" style="margin-right: 1rem;">在弹窗的滚动容器中</bs-button>
      <bs-dropdown trigger="click" teleported>
        <bs-button class="dropdown-toggle" type="primary">你好，vue3</bs-button>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </header>

    <h3 style="margin-top: 100px">基本使用</h3>
    <div style="height: 400px;border: 1px solid #f60;overflow-y: auto;padding: 1rem;">
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <bs-dropdown placement="bottom" trigger="click" :teleported="false">
        <bs-button class="dropdown-toggle" type="primary">基本使用</bs-button>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item disabled>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <p>下拉菜单！</p>
      <bs-dropdown :teleported="true" style="margin-left: 100px;">
        <span>一个span</span>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </div>

    <h3 style="margin-top: 100px">对其方式</h3>
    <div>
      <bs-dropdown placement="top">
        <bs-button class="dropdown-toggle" type="primary">顶部左边对齐</bs-button>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <bs-dropdown placement="topRight" style="margin-left: 100px">
        <bs-button class="dropdown-toggle" type="primary">顶部右边对齐</bs-button>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <bs-dropdown placement="bottom" style="margin-left: 100px">
        <bs-button class="dropdown-toggle" type="primary" >底部左边对齐</bs-button>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <bs-dropdown placement="bottomRight" style="margin-left: 100px">
        <bs-button class="dropdown-toggle" type="primary" >底部右边对齐</bs-button>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <div style="margin-top: 50px">
        <bs-dropdown placement="right">
          <bs-button class="dropdown-toggle" type="primary">右边顶部对齐</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown trigger="hover" placement="rightBottom" style="margin-left: 100px;">
          <bs-button class="dropdown-toggle" type="primary">右边底部对齐</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="left" style="margin-left: 100px;">
          <bs-button class="dropdown-toggle" type="primary">左边顶部对齐</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="leftBottom" style="margin-left: 100px;">
          <bs-button class="dropdown-toggle" type="primary">左边底部对齐</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>
    </div>

    <h3 style="margin-top: 100px">click触发</h3>
    <div>
      <bs-dropdown trigger="click">
        <bs-button class="dropdown-toggle" type="primary">点击我吧</bs-button>
        <template #content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </div>

    <h3 style="margin-top: 100px">自动调整方向</h3>
    <div>
      <h5>1、向下</h5>
      <div class="d-flex">
        <bs-dropdown>
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>

      <h5 style="margin-top: 50px;">2、向上</h5>
      <div class="d-flex">
        <bs-dropdown placement="top">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="top" class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>

      <h5 style="margin-top: 50px;">3、向左</h5>
      <div class="d-flex">
        <bs-dropdown placement="left">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="left" class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>

      <h5 style="margin-top: 50px;">4、向右</h5>
      <div class="d-flex">
        <bs-dropdown placement="right">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="right" class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>

      <h3>隐藏时销毁下拉内容</h3>
      <div>
        <bs-dropdown :destroy-dropdown-menu-on-hide="true">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>

    </div>

    <!--<div class="fixed-box">
      <h3>在fixed容器中</h3>
      <bs-dropdown trigger="click">
        <bs-button class="dropdown-toggle" type="primary">网页三剑客</bs-button>
        <template #content>
          <bs-dropdown-item>Javascript</bs-dropdown-item>
          <bs-dropdown-item>Css</bs-dropdown-item>
          <bs-dropdown-item>Html</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </div>-->

    <bs-modal title="Bootstrap Modal" v-model:visible="modalVisible">
      <h2>Bootstrap</h2>
      <p>Bootstrap 是全球最受欢迎的前端开源工具库，它支持 Sass 变量和 mixin、响应式栅格系统、自带大量组件和众多强大的 JavaScript 插件。基于 Bootstrap 提供的强大功能，能够让你快速设计并定制你的网站。</p>
      <h3>安装 Bootstrap</h3>
      <p>通过 npm、Composer、或者 Meteor，可以将 Bootstrap 的 Sass 和 JavaScript 源码安装到本地。</p>
      <div>
        <bs-dropdown placement="bottom" trigger="click" :teleported="false">
          <bs-button class="dropdown-toggle" type="primary">网页三剑客</bs-button>
          <template #content>
            <bs-dropdown-item>Html</bs-dropdown-item>
            <bs-dropdown-item>Css</bs-dropdown-item>
            <bs-dropdown-item>Javascript</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>
      <h3>jsDelivr</h3>
      <p>如果你只是需要使用 Bootstrap 的预编译 CSS 或 JS 文件，你可以直接使用 jsDelivr 提供的免费 CDN 加速服务。</p>
      <h3>Bootstrap 图标库</h3>
      <p>Bootstrap 有史以来第一次拥有自己的开源 SVG 图标库，旨在配合我们的组件和文档一起使用。</p>
    </bs-modal>

    <bs-modal title="Bootstrap Modal" scrollable v-model:visible="modalVisible2">
      <h2>Bootstrap</h2>
      <p>Bootstrap 是全球最受欢迎的前端开源工具库，它支持 Sass 变量和 mixin、响应式栅格系统、自带大量组件和众多强大的 JavaScript 插件。基于 Bootstrap 提供的强大功能，能够让你快速设计并定制你的网站。</p>
      <h3>安装 Bootstrap</h3>
      <p>通过 npm、Composer、或者 Meteor，可以将 Bootstrap 的 Sass 和 JavaScript 源码安装到本地。</p>
      <div>
        <bs-dropdown placement="bottom" trigger="click" :teleported="false">
          <bs-button class="dropdown-toggle" type="primary">网页三剑客</bs-button>
          <template #content>
            <bs-dropdown-item>Html</bs-dropdown-item>
            <bs-dropdown-item>Css</bs-dropdown-item>
            <bs-dropdown-item>Javascript</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>
      <h3>jsDelivr</h3>
      <p>如果你只是需要使用 Bootstrap 的预编译 CSS 或 JS 文件，你可以直接使用 jsDelivr 提供的免费 CDN 加速服务。</p>
      <h3>Bootstrap 图标库</h3>
      <p>Bootstrap 有史以来第一次拥有自己的开源 SVG 图标库，旨在配合我们的组件和文档一起使用。</p>
    </bs-modal>

    <bs-drawer
      title="抽屉弹窗"
      v-model:visible="drawerVisible"
      width="30%">
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <bs-dropdown placement="top" trigger="click" :teleported="true">
        <bs-button class="dropdown-toggle" type="primary">网页三剑客</bs-button>
        <template #content>
          <bs-dropdown-item>Html</bs-dropdown-item>
          <bs-dropdown-item>Css</bs-dropdown-item>
          <bs-dropdown-item>Javascript</bs-dropdown-item>
        </template>
      </bs-dropdown>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <bs-dropdown placement="top" trigger="click" :teleported="true">
        <bs-button class="dropdown-toggle" type="primary">网页三剑客</bs-button>
        <template #content>
          <bs-dropdown-item>Html</bs-dropdown-item>
          <bs-dropdown-item>Css</bs-dropdown-item>
          <bs-dropdown-item>Javascript</bs-dropdown-item>
        </template>
      </bs-dropdown>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <p>这是一个抽屉弹窗</p>
      <template #footer>
        <bs-button type="primary">确定</bs-button>
      </template>
    </bs-drawer>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsDropdownUsage',
  components: {},

  setup (props: any) {
    let modalVisible = ref(false);
    let modalVisible2 = ref(false);
    let drawerVisible = ref(false);
    return {
      modalVisible,
      modalVisible2,
      drawerVisible
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  height: 2000px;
}
.fixed-header{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 60px;
  line-height: 60px;
  //padding: 0 20px;
  text-align: right;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  background-color: #fff;
}
h3{
  margin-bottom: 0.8rem;
  margin-top: 5rem;
}
.fixed-box{
  position: fixed;
  top: 40%;
  right: 10%;
  z-index: 15;
  padding: 1.2rem;
  box-shadow: 0 0 .6rem rgba(0,0,0,0.3);
  background-color: #fff;
  h3{
    margin-top: 0;
  }
}
</style>
