<template>
  <div
    class="input-group bs-input"
    :class="{
      disabled,
      'has-show-password_icon': showPasswordIconDisplay,
      'has-clear-content_icon': clearContentIconDisplay,
      'has-suffix-icon': (suffixIcon || hasSuffix) || showPassword || clearable,
      'has-prefix-icon': prefixIcon || hasPrefix
    }">
    <div class="input-group-prepend" v-if="hasPrepend">
      <slot name="prepend"></slot>
    </div>
    <div
      class="bs-input-wrap"
      @mouseenter="on_mouseenter"
      @mouseleave="on_mouseleave">
      <input
        ref="inputRef"
        :type="inputType"
        class="form-control"
        v-bind="$attrs"
        :class="inputClass"
        :value="inputValue"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :aria-label="placeholder"
        @input="on_input"
        @change="on_change"
        @focus="on_focus"
        @blur="on_blur">
      <div
        v-if="suffixIcon || hasPrefix"
        class="bs-input-prefix">
        <span class="bs-input-suffix-icon custom-suffix-icon">
          <slot name="prefix">
            <bs-icon :name="prefixIcon"></bs-icon>
          </slot>
        </span>
      </div>
      <div
        v-if="(suffixIcon || hasSuffix) || showPassword || clearable"
        class="bs-input-suffix">
        <span
          v-if="suffixIcon || hasSuffix"
          class="bs-input-suffix-icon custom-suffix-icon">
          <slot name="suffix">
            <bs-icon :name="suffixIcon"></bs-icon>
          </slot>
        </span>
        <span
          v-if="clearContentIconDisplay"
          class="bs-input-suffix-icon clear-content_icon"
          @click="clearContent">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  class="bs-svg-icon" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>
        </span>
        <span
          v-if="showPasswordIconDisplay"
          class="bs-input-suffix-icon show-password_icon"
          @click="togglePasswordText">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bs-svg-icon" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
</svg>
        </span>
      </div>

    </div>
    <div class="input-group-append" v-if="hasAppend">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch, onUpdated } from 'vue';
type InputType = 'text' | 'password' | 'number' | 'email' | 'file' | 'hidden' | 'image' | 'submit' | 'button' | 'reset';
type InputSize = 'lg' | 'sm';

export default defineComponent({
  name: 'BsInput',
  components: {},

  props: {
    modelValue: {
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
    }
  },
  inheritAttrs: false,
  emits: ['input', 'update:modelValue', 'change', 'blur', 'focus', 'clear'],
  setup (props: any, ctx: any) {
    let hasPrepend = ref(!!ctx.slots.prepend); // 是否有前置插槽
    let hasAppend = ref(!!ctx.slots.append); // 是否有后置插槽
    let hasPrefix = ref(!!ctx.slots.prefix); // 是否有前置图标
    let hasSuffix = ref(!!ctx.slots.suffix); // 是否有后置图标
    onUpdated(() => {
      console.log('bs-input组件更新了！');
      hasPrepend.value = !!ctx.slots.prepend;
      hasAppend.value = !!ctx.slots.append;
      hasPrefix.value = !!ctx.slots.prefix;
      hasSuffix.value = !!ctx.slots.suffix;
    });

    let showPasswordIconDisplay = ref(false); // 切换输入框类型为“密码/文本”按钮是否显示
    let clearContentIconDisplay = ref(false); // 清空内容按钮是否显示

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
      let sizeClass = props.size ? `form-control-${props.size}` : '';
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
      hasPrepend,
      hasAppend,
      hasPrefix,
      hasSuffix,

      inputRef,
      inputClass,
      inputValue,
      inputType,
      showPasswordIconDisplay,
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
