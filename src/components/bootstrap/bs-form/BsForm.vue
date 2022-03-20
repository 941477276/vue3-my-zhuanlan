<template>
<form
  class="bs-form"
  :class="{
    'bs-form-hide-error-message': !showErrorMessage
  }">
  <slot></slot>
</form>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  ComponentInternalInstance
} from 'vue';
import { util } from '@/common/util';
type ValidateCallback = (valid:boolean) => void;

export default defineComponent({
  name: 'BsForm',
  props: {
    model: { // 表单数据对象
      type: Object,
      default () {
        return {};
      }
    },
    rules: { // 校验规则
      type: Object,
      default () {
        return {};
      }
    },
    showErrorMessage: { // 表单项校验失败时是否显示错误提示
      type: Boolean,
      default: true
    }
  },
  setup (props: any, ctx: any) {
    // 存储<bs-form-item>子组件
    let formItems = ref<ComponentInternalInstance[]>([]);
    /**
     * 添加form-item组件实例
     * @param formItem
     */
    let addFormItem = function (formItem: ComponentInternalInstance): void {
      if (!formItems.value.includes(formItem)) {
        formItems.value.push(formItem);
      }
      // console.log('formItems', formItems.value);
    };
    /**
     * 移除form-item组件实例
     * @param formItem
     */
    let removeFormItem = function (formItem: ComponentInternalInstance): void {
      let index = formItems.value.indexOf(formItem);
      if (index > -1) {
        formItems.value.splice(index, 1);
      }
    };

    /**
     *  校验表单
     * @param callback 回调函数
     */
    let validate = function (callback?: ValidateCallback): any {
      let promise;
      // 支持promise的情况下返回一个promise
      if (typeof callback !== 'function' && Promise) {
        promise = new Promise(function (resolve, reject) {
          callback = function (valid: boolean) {
            resolve(valid);
          };
        });
      }
      let formItemsIns = formItems.value;
      let trueFlag = true;
      if (formItemsIns.length === 0) {
        /* eslint-disable */
        callback?.(trueFlag);
        return promise;
      }
      let validateResult = true;
      formItemsIns.forEach(comIns => {
        // 调用<bs-form-item>子组件的validate方法获取校验结果
        /* eslint-disable */
        (comIns as any).ctx?.validate('', (errorMsg: string|undefined) => {
          if (typeof errorMsg !== 'undefined') {
            validateResult = false;
          }
        });
      });
      /* eslint-disable */
      callback?.(validateResult);
      return promise;
    };

    /**
     *  对部分表单项进行校验
     *  @param fieldPropNames 表单项的 fieldPropName 属性
     *  @param callback 回调函数
     */
    let validateFields = function (fieldPropNames: string|string[] = '', callback: ValidateCallback): any {
      let promise;
      // 支持promise的情况下返回一个promise
      if (typeof callback !== 'function' && Promise) {
        promise = new Promise(function (resolve, reject) {
          callback = function (valid: boolean) {
            resolve(valid);
          };
        });
      }
      let trueFlag = true;
      if (!fieldPropNames || fieldPropNames.length === 0) {
        callback(true);
        return promise;
      }
      let formItemsIns = formItems.value;
      if (formItemsIns.length === 0) {
        callback(trueFlag);
        return promise;
      }
      fieldPropNames = typeof fieldPropNames === 'string' ? [fieldPropNames] : fieldPropNames;
      let validateResult = true;
      formItemsIns.forEach(comIns => {
        if (fieldPropNames.includes(comIns.props.fieldPropName as string)) {
          // 调用<bs-form-item>子组件的validate方法获取校验结果
          /* eslint-disable */
          (comIns as any).ctx?.validate('', (errorMsg: string|undefined) => {
            if (typeof errorMsg !== 'undefined') {
              validateResult = false;
            }
          });
        }
      });

      callback(validateResult);
      return promise;
    };

    /**
     * 移除表单校验结果 表单项的 fieldPropName 属性
     * @param fieldPropNames
     */
    let clearValidate = function (fieldPropNames: string|string[] = '') {
      let formItemsIns = formItems.value;
      if (formItemsIns.length === 0) {
        return;
      }
      if (!fieldPropNames || fieldPropNames.length === 0) {
        formItemsIns.forEach(comIns => {
          /* eslint-disable */
          (comIns as any).ctx?.clearValidate();
        });
        return;
      }
      fieldPropNames = typeof fieldPropNames === 'string' ? [fieldPropNames] : fieldPropNames;
      formItemsIns.forEach(comIns => {
        if (fieldPropNames.includes(comIns.props.fieldPropName as string)) {
          /* eslint-disable */
          (comIns as any).ctx?.clearValidate();
        }
      });
    };
    /**
     * 重置表单值，并移除表单校验结果
     */
    let resetFields = function () {
      let formItemsIns = formItems.value;
      if (formItemsIns.length === 0) {
        return;
      }
      formItemsIns.forEach(comIns => {
          /* eslint-disable */
          (comIns as any).ctx?.resetField();
      });
    };

    return {
      addFormItem,
      removeFormItem,
      validate,
      validateFields,
      resetFields,
      clearValidate
    };
  }
});
</script>

<style lang="scss">
.bs-form{
  &.bs-form-hide-error-message{
    .bs-form-item-invalid > .bs-form-item-content > .invalid-feedback,
    .bs-form-item-invalid > .bs-form-item-content > .invalid-tooltip{
      display: none;;
    }
  }
}
</style>
