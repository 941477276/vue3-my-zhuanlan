<template>
  <component
    class="bs-radio-group"
    :is="elTag">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, provide, reactive } from 'vue';
import {
  radioGroupContextKey,
  RadioGroupContext
} from '@/ts-tokens/bootstrap/radio';

export default defineComponent({
  name: 'BsRadioGroup',
  components: {},

  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    elTag: { // 标签名称
      type: String,
      default: 'div'
    }
    /* disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    } */
  },
  inheritAttrs: false,
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let changeVal = function (val: string|number|boolean) {
      // console.log('input group值改变了');
      ctx.emit('update:modelValue', val);
      ctx.emit('change', val);
    };

    provide<RadioGroupContext>(radioGroupContextKey, reactive({
      props,
      changeVal
    }));

    return {
      changeVal
    };
  }
});
</script>

<style lang="scss">
.bs-radio-group{
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
</style>
