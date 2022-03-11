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
    <bs-input v-model="inputValue"></bs-input>
    <h2>inputValue的值为：{{inputValue}}</h2>
    <hr>
    <bs-input>
      <template #prepend v-if="showPrepend">
        一个前置slot
      </template>
    </bs-input>
    <hr>
    <h3>密码输入框</h3>
    <bs-input type="password" :show-password="true"></bs-input>
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
    let showPrepend = ref(false);

    let timer = setTimeout(() => {
      clearInterval(timer);
      // isDisabled.value = false;
      console.log('解禁了！');
      showPrepend.value = true;
    }, 1500);
    let inputValue = ref('哈哈');
    return {
      onClick,
      isDisabled,
      inputValue,

      showPrepend
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
