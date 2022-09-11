<template>
  <label
    class="form-check bs-radio"
    :class="{
      'is-disabled': disabled || disabledInner,
      'is-focus': isFocus,
      'is-checked': isChecked
    }">
    <input
      ref="radioInputRef"
      class="form-check-input"
      type="radio"
      autocomplete="off"
      :class="{
        'is-valid': validateStatus === 'success',
        'is-invalid': validateStatus === 'error'
      }"
      :name="name || null"
      :id="radioId"
      :value="value"
      :disabled="disabled || disabledInner"
      :data-checked="isChecked"
      :aria-label="ariaLabel || null"
      @focus="onFocus"
      @blur="onBlur"
      @change="on_change">
    <span class="form-check-input-inner"></span>
    <label
      v-if="$slots.default"
      class="form-check-label"
      :for="radioId">
      <slot></slot>
    </label>
  </label>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  nextTick,
  inject,
  watch,
  onUpdated
} from 'vue';
import {
  isFunction
} from '@vue/shared';
import { useSetValidateStatus } from '@/hooks/useSetValidateStatus';
import { FormItemContext, formItemContextKey } from '@/ts-tokens/bootstrap';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import {
  radioGroupContextKey,
  RadioGroupContext
} from '@/ts-tokens/bootstrap/radio';
import login from '@/pages/login/Login.vue';

// 统计单选框数量
let radioCount = 0;
export default defineComponent({
  name: 'BsRadio',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      default: '',
      required: true
    },
    disabled: {
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
    name: { // input原生的name属性
      type: String,
      default: ''
    },
    ariaLabel: { // area-label属性值
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur'],
  setup (props: any, ctx: any) {
    // 计算单选框的ID
    let radioId = ref(props.id || `bs-radio_${++radioCount}`);
    let isFocus = ref(false);
    let radioInputRef = ref<HTMLInputElement|null>(null);
    let radioGroupCtx = inject<RadioGroupContext|null>(radioGroupContextKey, null);
    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);
    let radioChecked = ref(false);

    let valueIsEqual = computed(() => {
      let flag = false;
      if (radioGroupCtx) {
        flag = (props.value === radioGroupCtx.props.modelValue) || (props.value === radioGroupCtx.props.value);
      } else {
        let { modelValue, value } = props;
        flag = (modelValue !== '' && value !== '') && modelValue === value;
      }
      return flag;
    });

    watch([valueIsEqual, radioChecked], function ([valueIsEqual, radioChecked]) {
      let radioEl = radioInputRef.value;
      if (!radioEl) {
        return;
      }
      radioEl.checked = valueIsEqual || radioChecked;
    }, { immediate: true });

    let isChecked = computed(() => {
      return valueIsEqual.value || radioChecked.value;
    });

    let disabledInner = ref(false);
    let readonlyInner = ref(false);
    let setDisabled = function (flag: boolean) {
      disabledInner.value = false;
    };
    let setReadonly = function (flag: boolean) {
      readonlyInner.value = false;
    };
    let { validateStatus, setValidateStatus, getValidateStatus } = useSetValidateStatus();

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
        if (formItemContext) {
          (formItemContext as any)[fnName](...args);
        }
      });
    };

    /* eslint-disable */
    let on_change = function (evt: Event) {
      // console.log(evt);
      let target = evt.target as HTMLInputElement;
      let resultValue = props.value == '' ? target.checked : props.value;
      radioChecked.value = target.checked;
      // console.log('radioChecked', radioChecked.value);
      if (radioGroupCtx) {
        // 调用<bs-radio-group>组件的changeVal方法将值传递出去，父组件setup中暴露出去的函数及属性都可以在父组件都ctx中获取的到
        radioGroupCtx.changeVal(resultValue);
      } else {
        ctx.emit('update:modelValue', resultValue);
      }
      ctx.emit('change', resultValue, evt);
      callFormItem('validate', 'change');
      let radioName = props.name;
      if (radioName) {
        let currentRadioEl = radioInputRef.value;
        let radios = document.querySelectorAll('.bs-radio input.form-check-input');
        for (let i = 0, len = radios.length; i < len; i++) {
          let radioEl = radios[i];
          if (radioEl !== currentRadioEl) {
            let setRadioChecked = (radioEl as any).setRadioChecked;
            if (isFunction(setRadioChecked)) {
              setRadioChecked(false);
            }
          }
        }
      }
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
        id: radioId.value,
        setValidateStatus
      };
      // 如果当前组件处在<bs-form-item>组件中，则将setValidateStatus方法存储到<bs-form-item>组件中
      useDeliverContextToParent<FormItemContext>(formItemContextKey, deliverToFormItemCtx);
    }

    onUpdated(function () {
      let radioEl = radioInputRef.value as any;
      if (!radioEl) {
        return;
      }
      // 给input绑定一个函数，以让外部可以修改单选框选中状态
      radioEl.setRadioChecked = function (checked: boolean) {
        radioChecked.value = !!checked;
      };
    });

    return {
      radioId,
      isFocus,
      isChecked,
      validateStatus,
      radioInputRef,

      disabledInner,
      readonlyInner,
      setDisabled,
      setReadonly,
      setValidateStatus,

      on_change,
      onBlur,
      onFocus
    };
  }
});
</script>

<style lang="scss">
@import "bs-radio";
</style>
