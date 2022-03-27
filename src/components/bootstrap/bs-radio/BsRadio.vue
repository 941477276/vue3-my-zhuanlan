<template>
  <div
    class="form-check bs-radio"
    :class="{
      'is-disabled': disabled || disabledInner,
      'is-readonly': readonly || readonlyInner,
      'is-focus': isFocus,
      'is-checked': isChecked
    }">
    <input
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
      :readonly="readonly || readonlyInner"
      :checked="isChecked"
      :aria-label="ariaLabel || null"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @change="on_change">
    <label
      class="form-check-label"
      :for="radioId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  nextTick,
  inject
} from 'vue';
import { getRadioCount } from '@/common/globalData';
import { useSetValidateStatus } from '@/hooks/useSetValidateStatus';
import { FormItemContext, formItemContextKey } from '@/ts-tokens/bootstrap';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import {
  radioGroupContextKey,
  RadioGroupContext
} from '@/ts-tokens/bootstrap/radio';

export default defineComponent({
  name: 'BsRadio',
  components: {},

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
    readonly: {
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
  inheritAttrs: false,
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let radioCount = getRadioCount();
    // 计算单选框的ID
    let radioId = ref(props.id || `bs-radio_${radioCount}`);
    let isFocus = ref(false);
    let radioGroupCtx = inject<RadioGroupContext|null>(radioGroupContextKey, null);
    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);

    let isChecked = computed(() => {
      let flag = false;
      if (radioGroupCtx) {
        flag = (props.value === radioGroupCtx.props.modelValue) || (props.value === radioGroupCtx.props.value);
      } else {
        flag = props.modelValue === props.value;
      }
      return flag;
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
      nextTick(function () {
        if (formItemContext) {
          (formItemContext as any)[fnName](...args);
        }
      });
    };

    /* eslint-disable */
    let on_change = function (evt: Event) {
      // console.log(evt);
      if (radioGroupCtx) {
        // 调用<bs-radio-group>组件的changeVal方法将值传递出去，父组件setup中暴露出去的函数及属性都可以在父组件都ctx中获取的到
        radioGroupCtx.changeVal(props.value);
      } else {
        ctx.emit('update:modelValue', props.value);
      }
      ctx.emit('change', props.value, evt);
      callFormItem('validate', 'change');
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

    return {
      radioId,
      isFocus,
      isChecked,
      validateStatus,

      disabledInner,
      readonlyInner,
      setDisabled,
      setReadonly,
      setValidateStatus,

      on_change
    };
  }
});
</script>

<style lang="scss">
.bs-radio{
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
  & + .bs-radio{
    margin-left: 20px;
  }
  .form-check-input{
    margin-top: 0.35rem;
  }
  .form-check-label{
    padding-left: 0.3rem;
    margin-left: -0.3rem;
  }
}
</style>
