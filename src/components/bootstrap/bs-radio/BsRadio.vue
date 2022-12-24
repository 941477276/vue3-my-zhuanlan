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
      :aria-label="ariaLabel || label || null"
      @focus="onFocus"
      @blur="onBlur"
      @change="on_change">
    <span class="form-check-input-inner"></span>
    <label
      class="form-check-label"
      :for="radioId">
      <slot>{{ label }}</slot>
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
import {
  radioGroupContextKey,
  RadioGroupContext
} from '@/ts-tokens/bootstrap/radio';
import { useDeliverContextToFormItem } from '@/hooks/useDeliverContextToFormItem';

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
    label: { // radio显示名称
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

    watch([valueIsEqual], function ([valueIsEqual]) {
      let radioEl = radioInputRef.value;
      if (!radioEl) {
        return;
      }
      radioEl.checked = valueIsEqual;
    }, { immediate: true });

    let isChecked = computed(() => {
      return valueIsEqual.value;
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

    /* eslint-disable */
    let on_change = function (evt: Event) {
      // console.log(evt);
      let target = evt.target as HTMLInputElement;
      let resultValue = props.value === '' ? target.checked : props.value;
      // radioChecked.value = target.checked;
      // console.log('radioChecked', radioChecked.value);
      if (radioGroupCtx) {
        // 调用<bs-radio-group>组件的changeVal方法将值传递出去，父组件setup中暴露出去的函数及属性都可以在父组件都ctx中获取的到
        radioGroupCtx.changeVal(resultValue);
      } else {
        ctx.emit('update:modelValue', resultValue);
      }
      ctx.emit('change', evt, resultValue);
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

    let { callFormItem } = useDeliverContextToFormItem(props, {
      id: radioId.value,
      setValidateStatus
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
