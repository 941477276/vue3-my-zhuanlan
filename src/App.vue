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
  <!--<div class="box">
    <bs-input v-model="inputValue" clearable></bs-input>
    <h2>inputValue的值为：{{inputValue}}</h2>
    <hr>
    <bs-input>
      <template #prepend v-if="showPrepend">
        一个前置slot
      </template>
    </bs-input>
    <hr>
    <h3>密码输入框</h3>
    <bs-icon name="eye"></bs-icon>
    <bs-input type="password" :show-password="true"></bs-input>
    <hr>
    <h3>带前置图标的输入框</h3>
    <bs-input placeholder="请输入名称进行查找" prefix-icon="search"></bs-input>
    <hr>
    <h3>带后置图标的输入框</h3>
    <bs-input suffix-icon="search"></bs-input>
    <hr>
    <h3>大的输入框</h3>
    <bs-input size="lg"></bs-input>
    <hr>
    <h3>小的输入框</h3>
    <bs-input size="sm"></bs-input>
    <hr>
    <h3>禁用的输入框</h3>
    <bs-input disabled></bs-input>
    <hr>
    <h3>只读的输入框</h3>
    <bs-input value="fsdfsd" readonly max="10"></bs-input>
  </div>-->
  <!--<div class="box">
    <h2>字符串类型的值</h2>
    <bs-radio v-model="radioVal" value="yuwen">语文</bs-radio>
    <bs-radio v-model="radioVal" value="shuxue">数学</bs-radio>
    <hr>
    <h2>数字类型的值</h2>
    <bs-radio v-model="radioValNumber" :value="1">男</bs-radio>
    <bs-radio v-model="radioValNumber" :value="2">女</bs-radio>
    <bs-radio v-model="radioValNumber" :value="3">人妖</bs-radio>
    <bs-radio v-model="radioValNumber" :value="4">未知</bs-radio>
    <hr>
    <h2>boolean类型的值</h2>
    <bs-radio v-model="radioVal" :value="true">启用</bs-radio>
    <bs-radio v-model="radioVal" :value="false">禁用</bs-radio>
  </div>-->
  <div class="box">
    <bs-radio-group v-model="inputGroupVal">
      <bs-radio value="yuwen">语文</bs-radio>
      <bs-radio value="shuxue">数学</bs-radio>
      <bs-radio value="yingyu">英语</bs-radio>
    </bs-radio-group>
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

    /* let timer = setTimeout(() => {
      clearInterval(timer);
      // isDisabled.value = false;
      console.log('解禁了！');
      showPrepend.value = true;
    }, 1500);
    let inputValue = ref('哈哈'); */

    let radioVal = ref('');
    let radioValNumber = ref(null);
    let radioValBool = ref(null);

    let inputGroupVal = ref('yingyu');

    return {
      onClick,
      isDisabled,
      // inputValue,
      radioVal,
      radioValNumber,
      radioValBool,

      inputGroupVal,

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
