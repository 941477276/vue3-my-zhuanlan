<template>
<div
  ref="bsFormItemRef"
  class="form-group bs-form-item"
  :class="{
    'bs-form-item-valid': validStatus === 'success',
    'bs-form-item-invalid': validStatus === 'error',
    'is-required': isRequired,
    'hide-required-asterisk': hideRequiredAsterisk
  }">
  <label
    :for="labelFor || htmlLabelFor || null"
    class="bs-form-label"
    :class="labelClass">
    <slot name="label">{{ label }}</slot>
  </label>
  <div
    class="bs-form-item-content"
    :class="contentClass">
    <slot></slot>
    <small
      v-if="(hintText != null && typeof hintText != 'undefined' && (hintText + '').length > 0) || $slots.hint"
      class="form-text text-muted">
      <slot name="hint">{{ hintText }}</slot>
    </small>
    <div
      v-if="validStatus === 'success' && (validSuccessText === 0 || !!validSuccessText)"
      class="valid-feedback">{{ validSuccessText }}</div>
    <div
      v-if="(invalidMessage + '').length > 0"
      v-html="invalidMessage"
      class="invalid-feedback"></div>
  </div>
</div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  reactive,
  inject,
  provide
} from 'vue';
import {
  isObject
} from '@vue/shared';
import {
  getPropValueByPath
} from '@/common/bs-util';
import Schema from 'async-validator';
import {
  FormContext,
  FormItemContext,
  ValidateStatus,
  FormItemValidateCallback,
  SetValidateStatusContext,
  formContextKey,
  formItemContextKey
} from '@/ts-tokens/bootstrap';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';

export default defineComponent({
  name: 'BsFormItem',
  props: {
    value: { // 当前表单项的值，仅用来校验当前表单项时使用
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    name: { // 字段在model中的key
      type: String,
      default: ''
    },
    rules: { // 当前表单的校验规则
      type: [Array, Object],
      default: () => []
    },
    labelFor: { // label的for属性
      type: String,
      default: ''
    },
    labelClass: { // label标签的额外classname
      type: String,
      default: ''
    },
    contentClass: { // 内容部分的额外class
      type: String,
      default: ''
    },
    hintText: { // 提示文字
      type: String,
      default: ''
    },
    validSuccessText: { // 表单校验成功后的文案
      type: String,
      default: ''
    },
    required: { // 是否必填，如不设置，则会根据校验规则自动生成
      type: Boolean,
      default: false
    },
    hideRequiredAsterisk: { // 是否隐藏必填字段的标签旁边的红色星号
      type: Boolean,
      default: false
    }
  },
  setup (props: any, ctx: any) {
    let bsFormItemRef = ref<HTMLElement>();
    // 校验状态
    let validStatus = ref<ValidateStatus>('');
    let formContext = inject<FormContext>(formContextKey);
    // 存储初始值，以遍在重置表单值时使用
    let initialVal:any = {};
    if (formContext) {
      initialVal = getPropValueByPath(formContext.props.model, props.name);
    }
    // console.log('初始值: ', initialVal);

    // 获取当前表单的校验规则
    let rules = computed<Array<any>>(function () {
      let propRules = props.rules;
      // 优先取组件自己的校验规则
      if (propRules) {
        if (Array.isArray(propRules) && propRules.length > 0) {
          return propRules;
        } else if (isObject(propRules) && !Array.isArray(propRules)) {
          return [propRules];
        }
      }
      if (!props.name) {
        // console.log('rules', 2);
        return [];
      }
      // 组件自己没有校验规则，再从<bs-form>父组件中的rules上取
      if (formContext && formContext.props.rules) {
        // console.log('rules', 3);
        let parentRules = formContext.props.rules;
        if (parentRules && isObject(parentRules)) {
          // console.log('rules', 4, rule);
          let itemRule = parentRules[props.name];
          if (Array.isArray(itemRule)) {
            return itemRule;
          } else if (isObject(itemRule)) {
            return [itemRule];
          }
        }
      }
      // console.log('rules', 5);
      return [];
    });

    // 是否必填
    let isRequired = computed(function () {
      let required = props.required;
      if (required) {
        return true;
      }
      let formItemRules = rules.value;
      required = formItemRules.some(ruleItem => ruleItem.required === true);
      return required;
    });

    // 表单校验失败文案
    let invalidMessage = ref<string>('');

    // 存储表单项子组件提供的方法
    let childComponentContext = ref<SetValidateStatusContext[]>([]);
    /**
     * 添加表单项子组件提供的方法
     * @param childCtx
     */
    let addChildComponentContext = function (childCtx: SetValidateStatusContext) {
      // console.log('调用了添加子组件方法');
      if (!childComponentContext.value.includes(childCtx)) {
        // console.log('添加子组件', childCtx);
        childComponentContext.value.push(childCtx);
      }
      // console.log('childComponentContext', childComponentContext.value);
    };
    /**
     * 移除存储的子组件
     * @param childCtx
     */
    let removeChildComponentContext = function (childCtx: SetValidateStatusContext) {
      let index: number = childComponentContext.value.findIndex(item => {
        if (typeof item.id !== 'undefined' && childCtx.id !== 'undefined') {
          return item.id === childCtx.id;
        }
        return item == childCtx;
      });
      // console.log('调用了移除子组件方法', childCtx, index);
      if (index > -1) {
        // console.log('移除子组件');
        childComponentContext.value.splice(index, 1);
        // console.log('childComponentContext', childComponentContext);
      }
    };
    // label标签的for属性值
    let htmlLabelFor = computed(function () {
      if (childComponentContext.value.length > 0) {
        return childComponentContext.value[0].id;
      }
      return '';
    });
    /* watch(childComponents, function (newChildComponents: ComponentInternalInstance[]) {
      console.log('newChildComponents 111', newChildComponents);
    }, { immediate: true }); */

    /**
     * 设置表单项子组件的校验状态
     * @param status
     */
    let setChildComponentsValidateStatus = function (status: ValidateStatus) {
      if (childComponentContext.value.length > 0) {
        childComponentContext.value.forEach((childCtx: SetValidateStatusContext) => {
          let setStatusFn = childCtx.setValidateStatus;
          if (typeof setStatusFn === 'function') {
            setStatusFn(status);
          }
        });
      }
    };

    /**
     * 对表单项进行校验
     * @param trigger 触发方式
     * @param callback 回调函数
     */
    let validate = function (trigger: string, callback?: FormItemValidateCallback) {
      if (typeof callback !== 'function') {
        /* eslint-disable */
        callback = function () {};
      }
      if (rules.value.length === 0) {
        callback?.('');
        return;
      }
      let fieldVal;
      if (props.name) {
        // 根据name从<bs-form>组件中传递下来的model对象中查找字段值
        fieldVal = getPropValueByPath(formContext?.props.model, props.name).value;
      } else {
        fieldVal = props.value;
      }
      // console.log('validate fieldVal', fieldVal);
      let rule = !trigger ? rules.value : rules.value.filter(ruleItem => {
        return Array.isArray(ruleItem.trigger) ? ruleItem.trigger.includes(trigger) : ruleItem.trigger === trigger;
      });
      // console.log('validate rule', rule, trigger);
      if (rule.length === 0) {
        callback?.('');
        return;
      }
      validStatus.value = 'validating';
      let descriptor = {
        [props.name || 'unnamed_field']: rule
      };

      let validator = new Schema(descriptor); // 创建校验器
      // console.log(validator);
      validator.validate({ [props.name || 'unnamed_field']: fieldVal }, { firstFields: true }, (errors, fields) => {
        // console.log('字段：', fields);
        if (errors) {
          // console.log('错误：', errors, (errors as Array<any>)[0].message);
          let errorMsg: string = (errors as Array<any>)[0].message;
          validStatus.value = 'error';
          setChildComponentsValidateStatus('error');
          invalidMessage.value = errorMsg;
          callback?.(errorMsg, fields);
          return;
        }
        validStatus.value = 'success';
        // console.log('校验成功！');
        setChildComponentsValidateStatus('success');
        invalidMessage.value = '';
        callback?.('');
      });
    };
    /**
     * 移除表单项的校验结果
     */
    let clearValidate = function () {
      validStatus.value = '';
      invalidMessage.value = '';
      setChildComponentsValidateStatus('');
    };
    /**
     *  重置表单结果
     */
    let resetField = function () {
      console.log('重置表单：', initialVal.parentObj, initialVal.lastKey, initialVal.value);
      let currentVal = getPropValueByPath(formContext?.props.model, props.name);
      // 根据name查找到该属性目前最新的父对象，因为业务组件在使用时可能会替换掉父对象
      currentVal.parentObj[initialVal.lastKey] = initialVal.value;
      clearValidate();
    };

    let provideVal: FormItemContext = reactive({
      $el: bsFormItemRef,
      validStatus,
      validate,
      clearValidate,
      resetField,
      addChildComponentContext,
      removeChildComponentContext
    });
    // 向子组件提供一些上下文参数
    provide(formItemContextKey, provideVal);

    // 提供一些上下文参数给<bs-form>父组件
    useDeliverContextToParent<FormContext>(formContextKey, {
      props,
      validate,
      clearValidate,
      resetField
    });

    return {
      bsFormItemRef,
      validStatus,
      htmlLabelFor,
      invalidMessage,
      isRequired,

      validate,
      clearValidate,
      resetField,
      addChildComponentContext,
      removeChildComponentContext
    };
  }
});
</script>
