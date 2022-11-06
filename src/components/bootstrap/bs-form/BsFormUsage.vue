<template>
  <div class="component-usage">
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
        :hide-required-asterisk="true"
        :rules="[{ required: true, trigger: 'change', message: '请输选择性别' }]">
        <bs-select v-model="formData.gender">
          <bs-option value="">请选择</bs-option>
          <bs-option value="man">男</bs-option>
          <bs-option value="woman">女</bs-option>
        </bs-select>
      </bs-form-item>
      <bs-form-item
        label="入职日期"
        field-prop-name="joinDate">
        <bs-date-picker
          v-model="formData.joinDate"
          value-format="YYYY-MM-DD"
          placeholder="请选择入职日期"></bs-date-picker>
      </bs-form-item>
      <bs-form-item
        label="上班开始时间"
        field-prop-name="workStartTime">
        <bs-time-picker
          v-model="formData.workStartTime"
          show-footer
          value-format="HH:mm:ss"
          placeholder="上班开始时间"></bs-time-picker>
      </bs-form-item>
      <bs-form-item
        label="工作时长"
        field-prop-name="workTimer">
        <bs-input-number
          v-model="formData.workTimer"
          placeholder="请填写工作时长"></bs-input-number>
      </bs-form-item>
      <bs-form-item
        label="每月发放薪酬时间"
        field-prop-name="paySalaryTime">
        <bs-date-picker
          v-model="formData.paySalaryTime"
          :time-panel-props="{valueFormat: 'HH时mm分ss秒'}"
          :date-panel-props="{valueFormat: 'YYYY-MM-DD'}"
          pickerType="dateTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择每月发放薪酬时间"></bs-date-picker>
      </bs-form-item>
      <bs-form-item
        label="标签"
        field-prop-name="tags">
        <bs-input-tags
          v-model="formData.tags"
          placeholder="请填写标签，按回车键确认"></bs-input-tags>
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

      <bs-button type="primary" style="margin-bottom: 10px;margin-right: 10px;" @click="confirmForm">提交</bs-button>
      <bs-button type="primary" style="margin-bottom: 10px;margin-right: 10px;" @click="clearValidate">移除校验结果</bs-button>
      <bs-button type="primary" style="margin-bottom: 10px;margin-right: 10px;" @click="resetFields">清空表单</bs-button>
      <bs-button type="primary" style="margin-bottom: 10px;margin-right: 10px;" @click="clearPartialValidate">移除部分表单校验结果</bs-button>
      <bs-button type="primary" style="margin-bottom: 10px;margin-right: 10px;" @click="validateFields">校验部分表单校验结果</bs-button>
    </bs-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, ComponentInternalInstance } from 'vue';
import BsDatePicker from '@/components/bootstrap/bs-date-picker/BsDatePicker';

export default defineComponent({
  name: 'BsFormUsage',
  components: { BsDatePicker },

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
      workTimer: '',
      joinDate: '',
      paySalaryTime: '2022-09-23 10时28分22秒',
      tags: [],
      workStartTimer: '',
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
        paySalaryTime: {required: true, trigger: ['change', 'blur'], message: '请填写每月发放薪酬时间'},
        joinDate: {required: true, trigger: ['change', 'blur'], message: '请填写入职日期'},
        workStartTime: [
          {required: true, trigger: ['change', 'blur'], message: '请填写上班时间'}
        ],
        workTimer: [
          {required: true, trigger: ['input', 'change', 'blur'], message: '请填写工作时长'},
          {type: 'number', trigger: ['input', 'change', 'blur'], transform: (val: string|number) => Number(val), min: 8, message: '工作时长不能低于8小时'},
          {type: 'number', trigger: ['input', 'change', 'blur'], transform: (val: string|number) => Number(val), max: 12, message: '工作时长不能高于12小时'},
        ],
        tags: [
          {required: true, type: 'array', trigger: ['change', 'blur'], min: 1, message: '请至少填写一个标签'}
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
          if (valid) {
            console.log('表单数据', formData);
          }
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

<style lang="scss" scoped>
.component-usage{
  max-width: 600px;
}
</style>
