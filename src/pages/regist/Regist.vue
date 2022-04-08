<template>
<div class="regist-page">
  <div class="container">
    <h1>注册我的专栏账号</h1>
    <bs-form
      ref="formRef"
      :model="formData"
      :rules="rules">
      <bs-form-item
        label="用户名："
        field-prop-name="nickName">
        <bs-input
          v-model="formData.nickName"
          clearable
          placeholder="请输入用户名"></bs-input>
      </bs-form-item>
      <bs-form-item
        label="密码："
        field-prop-name="password">
        <bs-input
          type="password"
          v-model="formData.password"
          placeholder="请输入密码"></bs-input>
      </bs-form-item>
      <bs-form-item
        label="电子邮箱："
        field-prop-name="email">
        <bs-input
          type="email"
          v-model="formData.email"
          placeholder="请输入电子邮箱"></bs-input>
      </bs-form-item>
      <bs-button
        type="primary"
        block
        :loading="committing"
        :disabled="committing"
        @click="submitForm">立即注册</bs-button>
    </bs-form>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref
} from 'vue';
import formRules from './useRules';
import { userApi } from '@/apis/userApi';
import { useRouter } from 'vue-router';
import { BsMessage } from '@/components/bootstrap/bs-message';

export default defineComponent({
  name: 'Regist',
  setup (props: any) {
    let formRef = ref(null);
    let committing = ref(false);
    let router = useRouter();
    let formData = reactive({
      nickName: '',
      password: '',
      email: ''
    });

    let submitForm = function () {
      if (committing.value) {
        return;
      }
      committing.value = true;
      (formRef.value as any).validate()
        .then(function (valid: boolean) {
          console.log('校验是否通过', valid);
          userApi.regist(formData.email, formData.password, formData.email)
            .then((res: any) => {
              committing.value = false;
              BsMessage.success?.('恭喜您，账户注册成功！即将前往登陆');
              let timer = setTimeout(function () {
                clearTimeout(timer);
                router.push('/login');
              }, 2000);
            })
            .catch(function () {
              committing.value = false;
            });
        })
        .catch(function (err: any) {
          console.log(err);
        });
    };
    return {
      formRef,
      formData,
      rules: formRules,
      committing,

      submitForm
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
