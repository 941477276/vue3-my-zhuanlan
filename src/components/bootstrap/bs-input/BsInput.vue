<template>
  <div
    class="input-group bs-input"
    :class="{disabled}">
    <div class="input-group-prepend" v-if="hasPrepend">
      <slot name="prepend"></slot>
    </div>
    <div class="bs-input-wrap">
      <input
        :type="inputType"
        class="form-control"
        v-bind="$attrs"
        :class="inputClass"
        :value="inputValue"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :aria-label="placeholder"
        @input="onInput">
        <span class="show-password-btn" @click="togglePasswordText"></span>
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
    size: { // 输入框大小
      type: String as PropType<InputSize>,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  inheritAttrs: false,
  emits: ['input', 'update:modelValue'],
  setup (props: any, ctx: any) {
    let hasPrepend = ref(!!ctx.slots.prepend);
    let hasAppend = ref(!!ctx.slots.append);
    onUpdated(() => {
      console.log('bs-input组件更新了！');
      hasPrepend.value = !!ctx.slots.prepend;
      hasAppend.value = !!ctx.slots.append;
    });

    let passwordIsShow = ref(false); // 密码是否显示了
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
    let onInput = function (evt: KeyboardEvent) {
      let val = (evt.target as HTMLInputElement).value;
      console.log('触发了input 事件');
      ctx.emit('update:modelValue', val);
      ctx.emit('input', val);
    };
    // 切换输入框类型为密码或文本
    let togglePasswordText = () => {
      console.log(12);
      if (props.showPassword) {
        console.log(123);
        passwordIsShow.value = !passwordIsShow.value;
      }
    };
    return {
      hasPrepend,
      hasAppend,

      inputClass,
      inputValue,
      inputType,
      onInput,
      togglePasswordText
    };
  },
  methods: {

  }
});
</script>

<style lang="scss">
.bs-input{
  width: auto;
  .bs-input-wrap{
    position: relative;
  }
  .show-password-btn{
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 1px;
    width: 30px;
    cursor: pointer;
    background-color: #ccc;
  }
}

</style>
