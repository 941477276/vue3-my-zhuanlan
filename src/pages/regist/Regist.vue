<template>
<div class="regist-page">
  <div class="container">
    <h1>注册我的专栏账号</h1>
    <bs-form
      :model="formData">
      <bs-form-item
        label="用户名：">
        <bs-input
          v-model="formData.username"
          clearable
          placeholder="请输入用户名"></bs-input>
      </bs-form-item>
      <bs-form-item
        label="密码：">
        <bs-input
          v-model="formData.pwd"
          placeholder="请输入密码"></bs-input>
      </bs-form-item>
      <bs-form-item
        label="电子邮箱：">
        <bs-input
          v-model="formData.email"
          placeholder="请输入电子邮箱"></bs-input>
      </bs-form-item>
      <bs-button type="primary" block>立即注册</bs-button>
    </bs-form>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive
} from 'vue';

export default defineComponent({
  name: 'Regist',
  setup (props: any) {
    let formData = reactive({
      username: '',
      pwd: '',
      email: ''
    });
    return {
      formData
    };
  }
});
</script>

<style lang="scss" scoped>
h1{
  padding: 2rem 0;
  text-align: center;
}
.bs-form{
  margin-bottom: 2rem;
}
.bs-input{
  width: 100%;
}
@media (min-width: 1200px) {
  .container{
    width: 960px;
  }
}
</style>
