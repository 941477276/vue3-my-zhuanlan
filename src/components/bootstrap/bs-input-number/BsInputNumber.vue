<template>
  <div class="bs-input-number"
    :class="[
      {
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
        'has-prefix': prefix,
        'is-disabled': disabled,
        'is-readonly': readonly,
        'out-of-range': max && (modelValue || 0) > (max || 0),
        'control-inner': controlInner,
        'control-out': !controlInner
      },
      size ? `bs-input-number-${size}` : ''
    ]">
    <div
      class="input-group"
      :class="[
        size ? `input-group-${size}` : ''
      ]">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <div class="input-group-text">
          <slot name="prepend"></slot>
        </div>
      </div>
      <button
        v-if="!controlInner"
        type="button"
        class="bs-input-number-decrease"
        aria-label="Decrease Value"
        :disabled="disabled || readonly || (min && modelValue <= min)"
        @focus="focus"
        @click="calculate(2)">
        <svg viewBox="0 0 16 16" width="1em" height="1em" class="bs-input-number-operate-icon miplus-icon" focusable="false" role="img" aria-label="dash" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g transform="translate(8 8) scale(1.25 1.25) translate(-8 -8)"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path></g></svg>
      </button>

      <div class="bs-input-number-wrapper">
        <label
          v-if="prefix"
          :for="inputId"
          class="bs-input-number-prefix">
          <span>{{ prefix }}</span>
        </label>
        <input
          :type="inputType"
          class="form-control"
          autocomplete="off"
          ref="inputRef"
          :class="[
            {
              'is-valid': validateStatus === 'success',
              'is-invalid': validateStatus === 'error'
            },
            size ? `form-control-${size}` : ''
          ]"
          :value="inputValue"
          :id="inputId"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder || null"
          :aria-label="ariaLabel || placeholder || null"
          :name="name || null"
          @input="on_input"
          @focus="on_focus"
          @blur="on_blur"
          @keydown.stop="on_keydown">
        <div
          v-if="controlInner"
          v-show="!disabled && !readonly"
          class="bs-input-number-operations">
          <button
            type="button"
            class="bs-input-number-increase"
            aria-label="Increase Value"
            :disabled="disabled || readonly || (max && modelValue >= max)"
            @focus="focus"
            @click="calculate(1)">+</button>
          <button
            type="button"
            class="bs-input-number-decrease"
            aria-label="Decrease Value"
            :disabled="disabled || readonly || (min && modelValue <= min)"
            @focus="focus"
            @click="calculate(2)">-</button>
        </div>
      </div>
      <button
        v-if="!controlInner"
        type="button"
        class="bs-input-number-increase"
        aria-label="Increase Value"
        :disabled="disabled || readonly || (max && modelValue >= max)"
        @focus="focus"
        @click="calculate(1)">
        <svg viewBox="0 0 16 16" width="1em" height="1em" class="bs-input-number-operate-icon plus-icon" focusable="false" role="img" aria-label="plus" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g transform="translate(8 8) scale(1.25 1.25) translate(-8 -8)"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path></g></svg>
      </button>
      <div class="input-group-append" v-if="$slots.append">
        <div class="input-group-text">
          <slot name="append"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  inject,
  nextTick
} from 'vue';
import { useSetValidateStatus } from '@/hooks/useSetValidateStatus';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import { bsInputNumberProps } from './bs-input-number-props';
import { useInputNumberMethods } from './useMethods';
import {
  FormItemContext,
  formItemContextKey
} from '@/ts-tokens/bootstrap';

let bsInputNumberCount = 0;
export default defineComponent({
  name: 'BsInputNumber',
  props: bsInputNumberProps,
  emits: ['input', 'update:modelValue', 'change', 'blur', 'focus', 'clear'],
  setup (props: any, ctx: any) {
    let inputId = ref('');
    if (props.id) {
      inputId.value = props.id;
    } else {
      inputId.value = `bs_input_number-${++bsInputNumberCount}`;
    }
    let inputType = computed(function () {
      if (props.type !== 'number') {
        return 'text';
      }
      return props.type;
    });

    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);
    let inputRef = ref<HTMLInputElement | null>(null);
    let { validateStatus, setValidateStatus, getValidateStatus } = useSetValidateStatus();

    let inputValue = computed(function () {
      let formatter = props.formatter;
      if (typeof formatter === 'function') {
        return formatter(props.modelValue);
      }
      // console.log('newValue', props.modelValue);
      return props.modelValue;
    });

    /**
     * 调用当前<bs-form-item>父组件的方法
     * @param fnName 方法名称
     * @param args 参数
     */
    let callFormItem = function (fnName: string, ...args: any) {
      if (!props.deliveContextToFormItem) {
        return;
      }
      nextTick(function () {
        if (formItemContext !== null) {
          (formItemContext as any)[fnName](...args);
        }
      });
    };

    // 事件处理
    /* eslint-disable */
    let { on_blur, on_focus, on_input, on_keydown, calculate } = useInputNumberMethods(props, ctx, callFormItem, inputRef);

    // 让元素获得焦点
    let focus = function () {
      (inputRef.value as HTMLInputElement).focus();
    };
    // 让元素失去焦点
    let blur = function () {
      (inputRef.value as HTMLInputElement).blur();
    };

    // 控制按钮点击事件
    let onControlBtnClick = function (type = 1) {
      if (props.disabled || props.readonly) {
        return;
      }
      focus();
      calculate(type);
    }

    if (props.deliveContextToFormItem) {
      // 传递给<bs-form-item>组件的参数
      let deliverToFormItemCtx = {
        id: inputId.value,
        setValidateStatus
      };
      // 如果当前组件处在<bs-form-item>组件中，则将setValidateStatus方法存储到<bs-form-item>组件中
      useDeliverContextToParent<FormItemContext>(formItemContextKey, deliverToFormItemCtx);
    }

    return {
      inputRef,
      inputId,
      validateStatus,
      inputValue,
      inputType,

      onControlBtnClick,
      on_input,
      // on_change,
      on_blur,
      on_focus,
      on_keydown,
      calculate,
      focus,
      blur,
      setValidateStatus
    };
  }
});
</script>

<style lang="scss">
@import "bs-input-number";
</style>
