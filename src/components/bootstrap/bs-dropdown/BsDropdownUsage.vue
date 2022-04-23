<template>
  <div class="component-usage">

    <header class="fixed-header">
      <bs-dropdown trigger="click">
        <bs-button class="dropdown-toggle" type="primary">你好，vue3</bs-button>
        <template #dropdown-content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>
    </header>

    <h3 style="margin-top: 100px">基本使用</h3>
    <div>
      <bs-dropdown>
        <bs-button class="dropdown-toggle" type="primary">基本使用</bs-button>
        <template #dropdown-content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <bs-dropdown style="margin-left: 100px;">
        <span>一个span</span>
        <template #dropdown-content>
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
        <template #dropdown-content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <bs-dropdown placement="topRight" style="margin-left: 100px">
        <bs-button class="dropdown-toggle" type="primary">顶部右边对齐</bs-button>
        <template #dropdown-content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <bs-dropdown placement="bottom" style="margin-left: 100px">
        <bs-button class="dropdown-toggle" type="primary" >底部左边对齐</bs-button>
        <template #dropdown-content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <bs-dropdown placement="bottomRight" style="margin-left: 100px">
        <bs-button class="dropdown-toggle" type="primary" >底部右边对齐</bs-button>
        <template #dropdown-content>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </bs-dropdown>

      <div style="margin-top: 50px">
        <bs-dropdown placement="right">
          <bs-button class="dropdown-toggle" type="primary">右边顶部对齐</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown trigger="hover" placement="rightBottom" style="margin-left: 100px;">
          <bs-button class="dropdown-toggle" type="primary">右边底部对齐</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="left" style="margin-left: 100px;">
          <bs-button class="dropdown-toggle" type="primary">左边顶部对齐</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="leftBottom" style="margin-left: 100px;">
          <bs-button class="dropdown-toggle" type="primary">左边底部对齐</bs-button>
          <template #dropdown-content>
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
        <template #dropdown-content>
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
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #dropdown-content>
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
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="top" class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #dropdown-content>
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
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="left" class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #dropdown-content>
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
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>

        <bs-dropdown placement="right" class="ml-auto">
          <bs-button class="dropdown-toggle" type="primary">下拉菜单</bs-button>
          <template #dropdown-content>
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
          <template #dropdown-content>
            <bs-dropdown-item>下拉框1</bs-dropdown-item>
            <bs-dropdown-item>下拉框2</bs-dropdown-item>
            <bs-dropdown-item>下拉框3</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BsDropdownUsage',
  components: {},

  setup (props: any) {
    return {

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
</style>
