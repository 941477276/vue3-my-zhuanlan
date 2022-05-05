<template>
  <div class="bs-input-number">
    <BsInput
      ref="inputRef"
      :id="id"
      :delive-context-to-form-item="deliveContextToFormItem"
      :disabled="disabled"
      :readonly="readonly"
      :size="size"
      :placeholder="placeholder"
      :name="name"
      :aria-label="ariaLabel"
      :suffix-icon="suffixIcon"
      :prefix-icon="prefixIcon"></BsInput>
    <div class="bs-input-number-operations">
      <button type="button" class="bs-input-number-increase" aria-label="Increase Value">+</button>
      <button type="button" class="bs-input-number-decrease" aria-label="Decrease Value">-</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  inject,
  nextTick
} from 'vue';
import { useSetValidateStatus } from '@/hooks/useSetValidateStatus';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import {
  FormItemContext,
  BsSize,
  BsInputType,
  formItemContextKey
} from '@/ts-tokens/bootstrap';
import BsInput from '@/components/bootstrap/bs-input/BsInput.vue';

let bsInputNumberCount = 0;
export default defineComponent({
  name: 'BsInputNumber',
  components: {
    BsInput
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    type: { // 输入框类型
      type: String as PropType<BsInputType>,
      default: 'text'
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
    size: { // 输入框大小
      type: String as PropType<BsSize>,
      default: ''
    },
    id: {
      type: String,
      default: '',
      validator (idVal: string) {
        if (typeof idVal !== 'string' || /^\d+/.test(idVal)) {
          console.warn('id必须为字符串类型，且不能以数字开头');
          return false;
        }
        return true;
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    suffixIcon: { // 尾部图标名称
      type: String,
      default: ''
    },
    prefixIcon: { // 首部图标名称
      type: String,
      default: ''
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
  emits: ['input', 'update:modelValue', 'change', 'blur', 'focus', 'clear'],
  setup (props: any, ctx: any) {
    let inputId = ref('');
    if (props.id) {
      inputId.value = props.id;
    } else {
      inputId.value = `bs_input_number-${++bsInputNumberCount}`;
    }

    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);
    let inputRef = ref<HTMLInputElement | null>(null);
    let { validateStatus, setValidateStatus, getValidateStatus } = useSetValidateStatus();

    /**
     * 调用当前<bs-form-item>父组件的方法
     * @param fnName 方法名称
     * @param args 参数
     */
    let callFormItem = function (fnName: string, ...args: any) {
      nextTick(function () {
        if (formItemContext !== null) {
          (formItemContext as any)[fnName](...args);
        }
      });
    };

    // input事件
    /* eslint-disable */
    let on_input = function (evt: Event) {

      ctx.emit('update:modelValue', 'val');
      ctx.emit('input', 'val');

      // callFormItem('validate', 'input');
    };
    let on_focus = function (evt: Event) {

      ctx.emit('focus', evt);
      // callFormItem('validate', 'focus');
    };
    let on_blur = function (evt: Event) {

      ctx.emit('blur', evt);
      // callFormItem('validate', 'blur');
    };
    let on_change = function (evt: Event) {
      // let val = (evt.target as HTMLInputElement).value;
      ctx.emit('change', evt);
      // callFormItem('validate', 'change');
    };
    let on_mouseenter = function (evt: MouseEvent) {

    };
    let on_mouseleave = function (evt: MouseEvent) {

    };

    // 让元素获得焦点
    let focus = function () {
      (inputRef.value as HTMLInputElement).focus();
    };
    // 让元素失去焦点
    let blur = function () {
      (inputRef.value as HTMLInputElement).blur();
    };


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

      on_input,
      on_change,
      on_blur,
      on_focus,
      on_mouseenter,
      on_mouseleave,
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
