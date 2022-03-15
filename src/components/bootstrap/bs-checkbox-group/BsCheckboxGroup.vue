<template>
  <component
    class="bs-checkbox-group"
    :is="elTag">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BsCheckboxGroup',
  components: {},

  props: {
    modelValue: {
      type: [Array, String],
      default: undefined
    },
    value: {
      type: Array,
      default: undefined
    },
    elTag: { // 标签名称
      type: String,
      default: 'div'
    },
    min: { // 可被勾选的 checkbox 的最小数量
      type: Number,
      default: undefined
    },
    max: { // 可被勾选的 checkbox 的最大数量
      type: Number,
      default: undefined
    }
  },
  inheritAttrs: false,
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    if (typeof props.modelValue === 'string') {
      ctx.emit('update:modelValue', props.modelValue.length === 0 ? [] : props.modelValue.split(','));
    }
    let changeVal = function (val: string|number|boolean) {
      // console.log('input group值改变了');
      ctx.emit('update:modelValue', val);
      ctx.emit('change', val);
    };
    return {
      changeVal
    };
  }
});
</script>

<style lang="scss">
.bs-checkbox-group{
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
</style>
