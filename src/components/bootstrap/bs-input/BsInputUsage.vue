<template>
<div class="component-usage">
  <bs-input v-model="inputValue" clearable></bs-input>
  <h2>inputValue的值为：{{inputValue}}</h2>
  <hr>
  <bs-input>
    <template #prepend>
      一个前置slot
    </template>
  </bs-input>
  <hr>
  <bs-input>
    <template #prepend>
      <bs-button type="primary">一个按钮</bs-button>
    </template>
  </bs-input>
  <hr>
  <bs-input>
    <template #append>
      后置slot
    </template>
  </bs-input>
  <hr>
  <bs-input>
    <template #prepend>
      一个前置slot
    </template>
    <template #append>
      后置slot
    </template>
  </bs-input>
  <hr>
  <h3>密码输入框</h3>
  <bs-icon name="eye"></bs-icon>
  <bs-input type="password" :show-password="true"></bs-input>
  <hr>
  <h3>文本域</h3>
  <bs-input style="margin-bottom: 25px;" type="textarea" v-model="textareaVal"></bs-input>
  <bs-input type="textarea" v-model="textareaVal">
    <template #append>
      后置slot
    </template>
  </bs-input>
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
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BsInputUsage',
  components: {},

  setup (props: any) {
    let inputValue = ref('哈哈');
    let textareaVal = ref('文本框');
    return {
      inputValue,
      textareaVal
    };
  }
});
</script>

<style scoped>

</style>
