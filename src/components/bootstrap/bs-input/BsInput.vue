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
        'has-prefix-icon': prefixIcon || $slots.prefix
      },
      inputClass
    ]">
    <template v-if="type != 'textarea'">
      <div class="input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <div
        class="bs-input-wrap"
        @mouseenter="on_mouseenter"
        @mouseleave="on_mouseleave">
        <input
          ref="inputRef"
          class="form-control"
          autocomplete="off"
          :type="inputType"
          v-bind="$attrs"
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
          @blur="on_blur">
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
            v-show="suffixIcon || $slots.suffix"
            class="bs-input-suffix-icon custom-suffix-icon">
            <slot name="suffix">
              <bs-icon :name="suffixIcon"></bs-icon>
            </slot>
          </span>
          <span
            v-show="clearContentIconDisplay"
            class="bs-input-suffix-icon clear-content_icon"
            @click="clearContent">
            <bs-icon name="x-circle"></bs-icon>
          </span>
          <span
            v-show="showPasswordIconDisplay"
            class="bs-input-suffix-icon show-password_icon"
            @click="togglePasswordText">
            <bs-icon :name="passwordIsShow ? 'eye-slash' : 'eye'"></bs-icon>
          </span>
        </div>

      </div>
      <div class="input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>

    <textarea
      v-else
      ref="inputRef"
      class="form-control"
      autocomplete="off"
      v-bind="$attrs"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue';
import { getInputCount, getTextAreaCount } from '@/common/globalData';

type InputType = 'text' | 'password' | 'number' | 'textarea' | 'email' | 'file' | 'hidden' | 'image' | 'submit' | 'button' | 'reset';
type InputSize = 'lg' | 'sm';

export default defineComponent({
  name: 'BsInput',
  components: {},

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
      type: String as PropType<InputType>,
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
    size: { // 输入框大小
      type: String as PropType<InputSize>,
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
    let showPasswordIconDisplay = ref(false); // 切换输入框类型为“密码/文本”按钮是否显示
    let clearContentIconDisplay = ref(false); // 清空内容按钮是否显示
    let inputId = ref('');
    if (props.id) {
      inputId.value = props.id;
    } else {
      if (props.type === 'textarea') {
        inputId.value = `bs-textarea_${getTextAreaCount()}`;
      } else {
        inputId.value = `bs-input_${getInputCount()}`;
      }
    }

    let passwordIsShow = ref(false); // 密码是否显示了
    // 切换输入框类型为密码或文本
    let togglePasswordText = () => {
      if (props.showPassword) {
        passwordIsShow.value = !passwordIsShow.value;
      }
    };

    let inputRef = ref<HTMLInputElement | null>(null);
    // 计算输入框的class
    let inputClass = computed<string>(() => {
      let sizeClass = props.size ? `input-group-${props.size}` : '';
      return sizeClass;
    });
    // 处理input的type
    let inputType = computed(() => {
      if (props.showPassword && passwordIsShow.value) {
        return 'text';
      }
      return props.type;
    });

    // 处理input的值
    let inputValue = ref<string|number>(props.modelValue);
    watch(() => props.modelValue, newVal => {
      if (inputValue.value != newVal) {
        inputValue.value = newVal;
      }
    });

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
    };
    let on_focus = function (evt: Event) {
      if (props.showPassword) {
        showPasswordIconDisplay.value = true; // 当类型为密码框，并且需要显示切换输入框类型按钮时在输入框获得焦点时显示切换类型按钮
      }
      if (props.clearable && (inputValue.value + '').length > 0) {
        clearContentIconDisplay.value = true;
      }
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
    };
    let on_change = function (evt: Event) {
      let val = (evt.target as HTMLInputElement).value;
      ctx.emit('change', val);
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

    return {
      inputRef,
      inputClass,
      inputValue,
      inputType,
      inputId,
      showPasswordIconDisplay,
      passwordIsShow,
      clearContentIconDisplay,

      on_input,
      on_change,
      on_blur,
      on_focus,
      on_mouseenter,
      on_mouseleave,
      togglePasswordText,
      clearContent,
      focus,
      blur
    };
  },
  methods: {

  }
});
</script>

<style lang="scss">
@import "bs-input";
</style>
