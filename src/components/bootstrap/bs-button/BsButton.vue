<template>
  <button
    :type="nativeType"
    class="btn"
    :class="btnClass">Primary</button>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue';
// 定义按钮支持类型
type buttonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
const supportTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'];
const nativeTypes = ['button', 'submit'];

export default defineComponent({
  name: 'BsButton',
  props: {
    type: { // 按钮类型
      type: String as PropType<buttonType>,
      default: 'primary',
      validator (typeVal: buttonType) {
        return supportTypes.includes(typeVal);
      }
    },
    nativeType: { // 原生按钮类型
      type: String,
      default: 'button',
      validator (nativeTypeVal: string) {
        return nativeTypes.includes(nativeTypeVal);
      }
    }
  },
  setup (props, ctx) {
    let btnClass = reactive([]);
    btnClass.push(props.type);

    return {
      btnClass
    };
  }
});
</script>

<style lang="scss">

</style>
