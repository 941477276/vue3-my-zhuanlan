<template>
  <label
    class="form-check bs-checkbox"
    :class="{
      'is-disabled': disabled || disabledInner,
      'is-focus': isFocus,
      'is-checked': isChecked,
      'is-indeterminate': isIndeterminate
    }">
    <input
      v-if="trueValue || falseValue"
      ref="checkboxRef"
      class="form-check-input"
      :class="{
        'is-valid': validateStatus === 'success',
        'is-invalid': validateStatus === 'error'
      }"
      type="checkbox"
      autocomplete="off"
      :name="name || null"
      :id="checkboxId"
      :true-value="trueValue"
      :false-value="falseValue"
      v-model="checkboxVal"
      :disabled="disabled || disabledInner || isCountLimitDisable"
      :indeterminate="indeterminate"
      :aria-label="ariaLabel || null"
      @focus="onFocus"
      @blur="onBlur"
      @change="on_change">
    <input
      v-else
      ref="checkboxRef"
      class="form-check-input"
      :class="{
        'is-valid': validateStatus === 'success',
        'is-invalid': validateStatus === 'error'
      }"
      type="checkbox"
      autocomplete="off"
      v-model="checkboxVal"
      :name="name || null"
      :id="checkboxId"
      :value="value"
      :indeterminate="indeterminate"
      :disabled="disabled || disabledInner || isCountLimitDisable"
      :aria-label="ariaLabel || null"
      @focus="onFocus"
      @blur="onBlur"
      @change="on_change">
    <span class="form-check-input-inner"></span>
    <label
      class="form-check-label"
      :for="checkboxId">
      <slot></slot>
    </label>
  </label>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  inject,
  watch
} from 'vue';
import { useSetValidateStatus } from '@/hooks/useSetValidateStatus';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import { useCheckbox } from './useCheckbox';
import { util } from '@/common/util';
import {
  FormItemContext,
  formItemContextKey
} from '@/ts-tokens/bootstrap';

// 统计复选框数量
let checkboxCount = 0;
export default defineComponent({
  name: 'BsCheckbox',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array],
      default: undefined
    },
    value: {
      type: [String, Number, Boolean],
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    indeterminate: { // 是否为不确定状态
      type: Boolean,
      default: false
    },
    deliveContextToFormItem: { // 是否向form-item组件传递上下文信息
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: '',
      validator (idVal: string) {
        if (/^\d/.test(idVal)) {
          console.warn('id不能以数字开头');
          return false;
        }
        return true;
      }
    },
    trueValue: { // 选中时的值
      type: [String, Number],
      default: undefined
    },
    falseValue: { // 没有选中时的值
      type: [String, Number],
      default: undefined
    },
    name: { // input原生的name属性
      type: String,
      default: ''
    },
    ariaLabel: { // area-label属性值
      type: String,
      default: ''
    }
  },
  inheritAttrs: false,
  emits: ['update:modelValue', 'change', 'blur', 'focus'],
  setup (props: any, ctx: any) {
    let checkboxRef = ref<HTMLInputElement|null>(null);
    // 计算单选框的ID
    let checkboxId = ref(props.id || `bs-checkbox_${++checkboxCount}`);
    let isFocus = ref(false);
    let isIndeterminate = ref(props.indeterminate); // 判断是否为不确定状态

    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);
    let { checkboxVal, isChecked, isCountLimitDisable } = useCheckbox(props, ctx, checkboxRef);

    let disabledInner = ref(false);
    let setDisabled = function (flag: boolean) {
      disabledInner.value = false;
    };
    let { validateStatus, setValidateStatus, getValidateStatus } = useSetValidateStatus();
    /**
     * 调用当前<bs-form-item>父组件的方法
     * @param fnName 方法名称
     * @param args 参数
     */
    let callFormItem = function (fnName: string, ...args: any) {
      nextTick(function () {
        if (formItemContext) {
          (formItemContext as any)[fnName](...args);
        }
      });
    };

    /* eslint-disable */
    let on_change = function (evt: Event) {
      let isChecked = (evt.target as HTMLInputElement).checked;
      // console.log('是否选中', isChecked);
      if (typeof props.indeterminate === 'boolean') {
        console.log('值改变了');
        isIndeterminate.value = false;
      }

      let value = '';
      if (isChecked) {
        value = !util.varIsNone(props.value) ? props.value : (util.varIsNone(props.trueValue) ? true : props.trueValue);
      } else {
        value = util.varIsNone(props.value) ? props.value : (util.varIsNone(props.falseValue) ? true : props.falseValue);
      }
      ctx.emit('change', value);

      callFormItem('validate', 'change');
    };

    let onBlur = function (evt: MouseEvent) {
      isFocus.value = false;
      ctx.emit('blur', evt);
    };

    let onFocus = function (evt: MouseEvent) {
      isFocus.value = true;
      ctx.emit('focus', evt);
    };

    if (props.deliveContextToFormItem) {
      // 传递给<bs-form-item>组件的参数
      let deliverToFormItemCtx = {
        id: checkboxId.value,
        setValidateStatus
      };
      // 如果当前组件处在<bs-form-item>组件中，则将setValidateStatus方法存储到<bs-form-item>组件中
      useDeliverContextToParent<FormItemContext>(formItemContextKey, deliverToFormItemCtx);
    }

    let stopWatchIndeterminate = watch(() => props.indeterminate, function (indeterminate) {
      isIndeterminate.value = indeterminate;
    });

    onMounted(() => {
      // 设置默认选择项
      if (props.checked) {
        // 60秒后再设置默认选中向是因为有可能<bs-checkbox-group>组件的modelValue值为空字符串
        // 在<bs-checkbox-group>组件中，modelValue值若为字符串类型，会先转成数组，所以子组件在设置默认选中项时需延迟一点
        let timer = setTimeout(() => {
          clearTimeout(timer);
          let checkboxValue = checkboxVal.value;
          if (Array.isArray(checkboxValue) && !checkboxValue.includes(props.value)) {
            checkboxValue.push(props.value);
          } else {
            checkboxVal.value = util.varIsNone(props.trueValue) ? true : props.trueValue;
          }
        }, 60);
      }
    });

    onUnmounted(function () {
      // 设置默认选择项
      if (props.checked) {
        let checkboxValue = checkboxVal.value;
        if (Array.isArray(checkboxValue)) {
          console.log('onUnmounted checkboxValue 11', checkboxValue);
          let index = checkboxValue.findIndex(item => item === props.value);
          if (index > -1) {
            checkboxValue.splice(index, 1);
          }
        } else {
          console.log('onUnmounted checkboxValue 22', checkboxValue);
          checkboxVal.value = false;
        }
      }
      stopWatchIndeterminate();
    });

    return {
      checkboxRef,
      checkboxId,
      isFocus,
      isChecked,
      isCountLimitDisable,
      isIndeterminate,

      checkboxVal,
      validateStatus,
      disabledInner,
      setDisabled,
      setValidateStatus,

      on_change,
      onBlur,
      onFocus
    };
  }
});
</script>

<style lang="scss">
@import "bs-checkbox";
</style>
