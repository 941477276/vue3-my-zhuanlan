<template>
  <!--<div class="box">
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
  </div>-->
  <div class="box">
    <bs-dropdown direction="top">
      <bs-button class="dropdown-toggle" @click="onClick">简单按钮</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown trigger="hover">
      <bs-button class="dropdown-toggle" @click="onClick">hover触发</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item divider>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown direction="top">
      <bs-button class="dropdown-toggle" @click="onClick">向上</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown direction="bottom">
      <bs-button class="dropdown-toggle" @click="onClick">向下</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown direction="left" style="margin-left: 30%;">
      <bs-button class="dropdown-toggle" @click="onClick">向左</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown direction="left">
      <bs-button class="dropdown-toggle" @click="onClick">向左2</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown direction="right">
      <bs-button class="dropdown-toggle" @click="onClick">向右</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown direction="right" style="margin-left: 95%;">
      <bs-button class="dropdown-toggle" @click="onClick">向右2</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item active>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
    <hr>
    <bs-dropdown :disabled="isDisabled" direction="right">
      <bs-button class="dropdown-toggle" @click="onClick">禁用的</bs-button>
      <template #dropdown-item>
        <bs-dropdown-item>JavaScript</bs-dropdown-item>
        <bs-dropdown-item>HTML</bs-dropdown-item>
        <bs-dropdown-item>CSS</bs-dropdown-item>
      </template>
    </bs-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    // HelloWorld
  },
  setup () {
    let onClick = function (evt: MouseEvent) {
      // console.log(evt);
    };
    let isDisabled = ref(true);

    /* let timer = setTimeout(() => {
      clearInterval(timer);
      isDisabled.value = false;
      console.log('解禁了！');
    }, 1500);
 */
    return {
      onClick,
      isDisabled
    };
  }
});
</script>

<style lang="scss">
body{
  height: 2000px;
}
.box{
  padding: 20px;
}
</style>
