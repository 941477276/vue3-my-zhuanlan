<template>
  <bs-form
    ref="formRef"
    :model="formData"
    :rules="rules">
    <bs-form-item label="用户名" field-prop-name="username">
      <bs-input v-model="formData.username"></bs-input>
      <template #hint>
        <p>用户名不能以数字开头</p>
      </template>
    </bs-form-item>
    <bs-form-item
      label="性别"
      field-prop-name="gender"
      :rules="[{ required: true, trigger: 'change', message: '请输选择性别' }]">
      <bs-select v-model="formData.gender">
        <bs-option value="">请选择</bs-option>
        <bs-option value="man">男</bs-option>
        <bs-option value="woman">女</bs-option>
      </bs-select>
    </bs-form-item>
    <bs-form-item label="爱好" field-prop-name="hobby">
      <bs-checkbox v-model="formData.hobby" v-if="show" checked value="yuwen">语文</bs-checkbox>
      <bs-checkbox v-model="formData.hobby" value="shuxue">数学</bs-checkbox>
      <bs-checkbox v-model="formData.hobby" value="yingyu">英语</bs-checkbox>
      <bs-checkbox v-model="formData.hobby" value="tiyu">体育</bs-checkbox>
      <bs-checkbox v-model="formData.hobby" value="wuli">物理</bs-checkbox>
      <bs-checkbox v-model="formData.hobby" value="shengwu">生物</bs-checkbox>
    </bs-form-item>
    <bs-form-item label="状态" field-prop-name="status">
      <bs-radio v-model="formData.status" :value="1">启用</bs-radio>
      <bs-radio v-model="formData.status" :value="0">禁用</bs-radio>
    </bs-form-item>

    <bs-button type="primary" @click="confirmForm">提交</bs-button>
    <bs-button type="primary" @click="clearValidate">移除校验结果</bs-button>
    <bs-button type="primary" @click="resetFields">清空表单</bs-button>
    <bs-button type="primary" @click="clearPartialValidate">移除部分表单校验结果</bs-button>
    <bs-button type="primary" @click="validateFields">校验部分表单校验结果</bs-button>
  </bs-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, ComponentInternalInstance } from 'vue';

export default defineComponent({
  name: 'BsFormUsage',
  setup (props: any) {
    let formRef = ref<ComponentInternalInstance|null>(null);
    let show = ref(true);
    let timer = setTimeout(function () {
      clearTimeout(timer);
      show.value = false;
    }, 1500);

    let formData = reactive({
      username: '',
      status: '',
      hobby: []
    });
    let rules = computed(function () {
      return {
        username: [
          { required: true, trigger: 'input', message: '请输入用户名', whitespace: true },
          {
            validator (rule: any, value: any, callback: any) {
              if (/^\d+/.test(value)) {
                callback(new Error('用户名不能以数字开头'));
                /* eslint-disable */
                // callback('用户名不能以数字开头');
              } else {
                callback();
              }
            },
            trigger: 'input'
          }
        ],
        hobby: [
          {required: true, type: 'array', trigger: 'change', min: 1, message: '请至少选择一个爱好'}
        ],
        status: [
          {required: true, type: 'number', trigger: 'change', message: '请选择状态'}
        ]
      };
    });

    let confirmForm = function () {
      console.log(formRef.value);
      (formRef.value as any).validate()
        .then((valid: boolean) => {
          console.log('表单校验结果：', valid);
        });
    };
    let clearValidate = function () {
      (formRef.value as any).clearValidate();
    };
    let resetFields = function () {
      (formRef.value as any).resetFields();
    };
    let clearPartialValidate = function () {
      (formRef.value as any).clearValidate(['gender', 'status']);
    };
    let validateFields = function () {
      (formRef.value as any).validateFields(['gender', 'status'])
        .then((valid: boolean) => {
          console.log('部分表单校验结果：', valid);
        });
    };

    return {
      formRef,

      formData,
      rules,
      show,

      confirmForm,
      resetFields,
      clearValidate,
      clearPartialValidate,
      validateFields
    };
  }
});
</script>

<style scoped>

</style>
