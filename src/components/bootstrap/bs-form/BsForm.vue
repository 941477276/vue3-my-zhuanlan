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
  provide,
  ref,
  reactive
} from 'vue';
import {
  FormContext,
  formContextKey
} from '@/ts-tokens/bootstrap';

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
    showLabel: { // 是否显示label
      type: Boolean,
      default: true
    },
    showErrorMessage: { // 表单项校验失败时是否显示错误提示
      type: Boolean,
      default: true
    }
  },
  setup (props: any, ctx: any) {
    // 存储<bs-form-item>子组件的上下文
    let formItemCtxs = ref<any[]>([]);
    /**
     * 添加form-item组件实例
     * @param formItem
     */
    let addFormItemCtx = function (formItem: any): void {
      if (!formItemCtxs.value.includes(formItem)) {
        formItemCtxs.value.push(formItem);
      }
      // console.log('formItemCtxs', formItemCtxs.value);
    };
    /**
     * 移除form-item组件实例
     * @param formItem
     */
    let removeFormItemCtx = function (formItem: any): void {
      let index = formItemCtxs.value.indexOf(formItem);
      if (index > -1) {
        formItemCtxs.value.splice(index, 1);
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
            valid ? resolve(valid) : reject(valid);
            // resolve(valid);
          };
        });
      }
      let formItemsCtxArr = formItemCtxs.value;
      console.log('<bs-form>validate函数，formItemsCtxArr：', formItemsCtxArr);
      let trueFlag = true;
      if (formItemsCtxArr.length === 0) {
        /* eslint-disable */
        callback?.(trueFlag);
        return promise;
      }
      let validateResult = true;
      formItemsCtxArr.forEach(formItemCtx => {
        // 调用<bs-form-item>子组件的validate方法获取校验结果
        /* eslint-disable */
        formItemCtx.validate?.('', (errorMsg: string|undefined) => {
          // console.log('11111111', errorMsg)
          if (errorMsg) {
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
    let validateFields = function (fieldPropNames: string|string[] = '', callback?: ValidateCallback): any {
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
        callback?.(true);
        return promise;
      }
      let formItemsArr = formItemCtxs.value;
      if (formItemsArr.length === 0) {
        callback?.(trueFlag);
        return promise;
      }
      fieldPropNames = typeof fieldPropNames === 'string' ? [fieldPropNames] : fieldPropNames;
      let validateResult = true;
      formItemsArr.forEach(formIteCtx => {
        if (fieldPropNames.includes(formIteCtx.props.name)) {
          // 调用<bs-form-item>子组件的validate方法获取校验结果
          /* eslint-disable */
          formIteCtx.validate?.('', (errorMsg: string|undefined) => {
            if (typeof errorMsg !== 'undefined') {
              validateResult = false;
            }
          });
        }
      });

      /* eslint-disable */
      callback?.(validateResult);
      return promise;
    };

    /**
     * 移除表单校验结果 表单项的 fieldPropName 属性
     * @param fieldPropNames
     */
    let clearValidate = function (fieldPropNames: string|string[] = '') {
      let formItemsArr = formItemCtxs.value;
      if (formItemsArr.length === 0) {
        return;
      }
      if (!fieldPropNames || fieldPropNames.length === 0) {
        formItemsArr.forEach(formItemCtx => {
          /* eslint-disable */
          formItemCtx.clearValidate?.();
        });
        return;
      }
      fieldPropNames = typeof fieldPropNames === 'string' ? [fieldPropNames] : fieldPropNames;
      formItemsArr.forEach(formItemCtx => {
        if (fieldPropNames.includes(formItemCtx.props.name as string)) {
          /* eslint-disable */
          formItemCtx.clearValidate?.();
        }
      });
    };
    /**
     * 重置表单值，并移除表单校验结果
     */
    let resetFields = function () {
      let formItemsArr = formItemCtxs.value;
      if (formItemsArr.length === 0) {
        return;
      }
      formItemsArr.forEach(formItemCtx => {
          /* eslint-disable */
          formItemCtx.resetField?.();
      });
    };

    provide(formContextKey, reactive({
      props,
      addChildComponentContext: addFormItemCtx,
      removeChildComponentContext: removeFormItemCtx,
      validate,
      validateFields,
      resetFields,
      clearValidate
    }));

    return {
      addFormItemCtx,
      removeFormItemCtx,
      validate,
      validateFields,
      resetFields,
      clearValidate
    };
  }
});
</script>
<style lang="scss">
@import "bs-form";
</style>
