<template>
  <div class="login-page">
    <div class="container">
      <h1>登陆到我的专栏</h1>
      <bs-form
        ref="formRef"
        :model="formData"
        :rules="rules">
        <bs-form-item
          label="邮箱："
          field-prop-name="email">
          <bs-input
            v-model="formData.email"
            clearable
            placeholder="请输入邮箱"></bs-input>
        </bs-form-item>
        <bs-form-item
          label="密码："
          field-prop-name="password">
          <bs-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"></bs-input>
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
import rules from './useRules';
import { userApi } from '@/apis/userApi';
import { BsMessage } from '@/components/bootstrap/bs-message';
import { useStore } from 'vuex';
import { accountUtil } from '@/common/accountUtil';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup (props: any) {
    let store = useStore();
    let router = useRouter();
    let route = useRoute();
    let committing = ref(false);
    let formRef = ref(null);
    let formData = reactive({
      email: '',
      password: ''
    });
    let submitForm = function () {
      if (committing.value) {
        return;
      }

      (formRef.value as any).validate()
        .then(function (valid: boolean) {
          console.log(valid);
          committing.value = true;
          userApi.login(formData.email, formData.password)
            .then(function (res) {
              committing.value = false;
              BsMessage.success?.('登陆成功！');
              let token = `Bearer ${res.data.token}`;
              store.commit('setToken', token);
              accountUtil.setToken(token);
              store.dispatch('getUserInfo');

              let redirect = route.query.redirect as string;
              if (redirect) {
                redirect = decodeURIComponent(redirect);
              }
              let timer = setTimeout(function () {
                clearTimeout(timer);
                router.replace(redirect ? redirect : '/');
              }, 1500);
            })
            .catch(function () {
              committing.value = false;
            });
        });
    };

    // store.dispatch('getUserInfo');

    return {
      formRef,
      committing,
      formData,
      rules,

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
