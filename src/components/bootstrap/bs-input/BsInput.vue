<template>
  <div
    class="input-group bs-input"
    :class="[
      {
        disabled,
        'has-show-password_icon': showPasswordIconDisplay,
        'has-clear-content_icon': clearContentIconDisplay,
        'has-custom-suffix_icon': suffixIcon || $slots.suffix,
        'has-suffix-icon': (suffixIcon || $slots.suffix) || showPassword || clearable,
        'has-prefix-icon': prefixIcon || $slots.prefix,
        'has-prepend': $slots.prepend,
        'has-append': $slots.append
      },
      inputClass
    ]">
    <div class="input-group-prepend" v-if="$slots.prepend">
      <div class="input-group-text">
        <slot name="prepend"></slot>
      </div>
    </div>
    <div
      class="bs-input-wrap"
      @mouseenter="on_mouseenter"
      @mouseleave="on_mouseleave">
      <input
        v-if="type != 'textarea'"
        ref="inputRef"
        class="form-control"
        autocomplete="off"
        :class="[
          {
            'is-valid': validateStatus === 'success',
            'is-invalid': validateStatus === 'error'
          },
          size ? `form-control-${size}` : ''
        ]"
        :type="inputType"
        :id="inputId"
        :value="inputValue || value"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder || null"
        :aria-label="ariaLabel || placeholder || null"
        :name="name || null"
        @input="on_input"
        @change="on_change"
        @focus="on_focus"
        @blur="on_blur" />

      <textarea
        v-else
        ref="inputRef"
        class="form-control"
        autocomplete="off"
        :class="{
          'is-valid': validateStatus === 'success',
          'is-invalid': validateStatus === 'error'
        }"
        :id="inputId"
        :value="inputValue || value"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder || null"
        :aria-label="ariaLabel || placeholder || null"
        :name="name || null"
        @input="on_input"
        @change="on_change"
        @focus="on_focus"
        @blur="on_blur"></textarea>
      <div
        v-if="prefixIcon || $slots.prefix"
        class="bs-input-prefix">
        <span class="bs-input-suffix-icon custom-suffix-icon">
          <slot name="prefix">
            <bs-icon :name="prefixIcon"></bs-icon>
          </slot>
        </span>
      </div>
      <div
        v-if="(suffixIcon || $slots.suffix) || showPassword || clearable"
        class="bs-input-suffix">
        <span
          v-if="suffixIcon || $slots.suffix"
          class="bs-input-suffix-icon custom-suffix-icon">
          <slot name="suffix">
            <bs-icon :name="suffixIcon"></bs-icon>
          </slot>
        </span>
        <span
          v-if="clearable"
          v-show="clearContentIconDisplay"
          :data-only-child="!suffixIcon && !$slots.suffix && !showPassword"
          class="bs-input-suffix-icon clear-content_icon"
          @click.stop="clearContent">
          <bs-icon name="x-circle"></bs-icon>
        </span>
        <span
          v-if="showPassword"
          v-show="showPasswordIconDisplay"
          class="bs-input-suffix-icon show-password_icon"
          @click.stop="togglePasswordText">
          <bs-icon :name="passwordIsShow ? 'eye-slash' : 'eye'"></bs-icon>
        </span>
      </div>

    </div>
    <div class="input-group-append" v-if="$slots.append">
      <div class="input-group-text">
        <slot name="append"></slot>
      </div>
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
import { useInput } from './useInput';
import {
  FormItemContext,
  BsSize,
  BsInputType,
  formItemContextKey
} from '@/ts-tokens/bootstrap';
import BsIcon from '../bs-icon/BsIcon.vue';

let inputCount = 0;
let textareaCount = 0;
export default defineComponent({
  name: 'BsInput',
  components: {
    BsIcon
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
    showPassword: { // 是否显示切换密码图标
      type: Boolean,
      default: false
    },
    clearable: { // 是否可以清空内容
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
  emits: ['input', 'update:modelValue', 'change', 'blur', 'focus', 'clear'],
  setup (props: any, ctx: any) {
    let showPasswordIconDisplay = ref(false); // 切换输入框类型为“密码/文本”按钮是否显示
    let clearContentIconDisplay = ref(false); // 清空内容按钮是否显示
    let inputId = ref('');
    if (props.id) {
      inputId.value = props.id;
    } else {
      if (props.type === 'textarea') {
        inputId.value = `bs-textarea_${++textareaCount}`;
      } else {
        inputId.value = `bs-input_${++inputCount}`;
      }
    }

    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);
    let inputRef = ref<HTMLInputElement | null>(null);
    let { passwordIsShow, inputValue, inputClass, inputType, togglePasswordText } = useInput(props);
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
      let val = (evt.target as HTMLInputElement).value;
      console.log('触发了input 事件');
      inputValue.value = val;
      if (props.clearable && val.length > 0) {
        clearContentIconDisplay.value = true;
      } else {
        clearContentIconDisplay.value = false;
      }
      ctx.emit('update:modelValue', val);
      ctx.emit('input', val);

      callFormItem('validate', 'input');
    };
    let on_focus = function (evt: Event) {
      if (props.showPassword) {
        showPasswordIconDisplay.value = true; // 当类型为密码框，并且需要显示切换输入框类型按钮时在输入框获得焦点时显示切换类型按钮
      }
      if (props.clearable && (inputValue.value + '').length > 0) {
        clearContentIconDisplay.value = true;
      }
      ctx.emit('focus', evt);
      callFormItem('validate', 'focus');
    };
    let on_blur = function (evt: Event) {
      if ((inputValue.value + '').length > 0) {
        if (props.showPassword) {
          showPasswordIconDisplay.value = true; // 当类型为密码框，并且输入框中有值，则显示切换类型按钮
        }
      } else {
        if (props.showPassword) {
          showPasswordIconDisplay.value = false;
        }
      }
      ctx.emit('blur', evt);
      callFormItem('validate', 'blur');
    };
    let on_change = function (evt: Event) {
      // let val = (evt.target as HTMLInputElement).value;
      ctx.emit('change', evt);
      callFormItem('validate', 'change');
    };
    let on_mouseenter = function (evt: MouseEvent) {
      if (props.clearable && (inputValue.value + '').length > 0) {
        clearContentIconDisplay.value = true;
      }
    };
    let on_mouseleave = function (evt: MouseEvent) {
      if (props.clearable && (inputValue.value + '').length > 0 && clearContentIconDisplay.value) {
        clearContentIconDisplay.value = false;
      }
    };
    // 清空内容
    let clearContent = function () {
      inputValue.value = '';
      clearContentIconDisplay.value = false;
      ctx.emit('update:modelValue', '');
      ctx.emit('clear');
      callFormItem('validate', 'change');
      focus();
    }
    // 让元素获得焦点
    let focus = function () {
      (inputRef.value as HTMLInputElement).focus();
    };
    // 让元素失去焦点
    let blur = function () {
      (inputRef.value as HTMLInputElement).blur();
    };
    /**
     *  切换清空内容按钮显示
     * @param flag
     */
    let setClearIconDisplay = function (flag: boolean) {
      clearContentIconDisplay.value = !!flag;
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
      inputClass,
      inputValue,
      inputType,
      inputId,
      showPasswordIconDisplay,
      passwordIsShow,
      clearContentIconDisplay,
      validateStatus,

      on_input,
      on_change,
      on_blur,
      on_focus,
      on_mouseenter,
      on_mouseleave,
      togglePasswordText,
      clearContent,
      focus,
      blur,
      setValidateStatus,
      setClearIconDisplay
    };
  },
  methods: {

  }
});
</script>

<style lang="scss">
@import "bs-input";
</style>
