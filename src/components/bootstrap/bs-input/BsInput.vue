<template>
  <div
    class="input-group bs-input"
    :class="{disabled}">
    <!--<div class="input-group-prepend">
      <span class="input-group-text" id="basic-addon1">@</span>
    </div>-->
    <div class="bs-input-wrap">
      <input
        type="text"
        class="form-control"
        :class="inputClass"
        :value="inputValue"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :aria-label="placeholder"
        @input="onInput">
    </div>
    <!--<div class="input-group-append">
      <span class="input-group-text" id="basic-addon2">@example.com</span>
    </div>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue';
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
    size: { // 输入框大小
      type: String as PropType<InputSize>,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['input', 'update:modelValue'],
  setup (props: any, ctx: any) {
    // 计算输入框的class
    let inputClass = computed<string>(() => {
      let sizeClass = props.size ? `form-control-${props.size}` : '';
      return sizeClass;
    });
    let inputValue = ref<string|number>(props.modelValue);
    watch(() => props.modelValue, newVal => {
      if (inputValue.value != newVal) {
        inputValue.value = newVal;
      }
    });
    let onInput = function (evt: KeyboardEvent) {
      let val = (evt.target as HTMLInputElement).value;
      ctx.emit('update:modelValue', val);
      ctx.emit('input', val);
    };
    return {
      inputClass,
      inputValue,
      onInput
    };
  },
  methods: {

  }
});
</script>

<style lang="scss">
.bs-input{
  width: auto;
}
</style>
