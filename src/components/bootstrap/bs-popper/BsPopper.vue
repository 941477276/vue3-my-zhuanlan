<template>
<slot></slot>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  provide,
  ref,
  watch
} from 'vue';
import {
  ForwardRefContext,
  useForwardRef
} from '@/hooks/useForwardRef';
import {
  BsPopperContext,
  bsPopperContextKey
} from '@/ts-tokens/bootstrap/popper';

export default defineComponent({
  name: 'BsPopper',
  props: {
    virtualTriggering: { // 是否由虚拟元素触发
      type: Boolean,
      default: false
    },
    virtualRef: { // 触发元素的ref
      type: [String, Function, Object],
      default: null
    },
    visibleArrow: { // 是否显示箭头
      type: Boolean,
      default: true
    },
    popperClass: { // popper的class
      type: String,
      default: ''
    },
    popperStyle: { // popper的style
      type: [String, Array, Object],
      default: ''
    },
    arrowClass: { // 三角箭头的class
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 0
    }
  },
  setup (props: any, ctx: any) {
    // 触发popper的元素
    let triggerRef = ref<HTMLElement|null>(null);
    // popper内容元素
    let popperContentRef = ref<HTMLElement|null>(null);
    // popper三角箭头元素
    let popperArrowRef = ref<HTMLElement|null>(null);

    // 向子孙组件传递（透传）触发popper元素的变量,让子孙组件去更新这个变量
    useForwardRef(triggerRef);

    provide<BsPopperContext>(bsPopperContextKey, {
      triggerRef,
      popperContentRef,
      popperArrowRef
    });

    watch(triggerRef, (newEl) => {
      console.log('newEl', newEl);
    });

    return {
      triggerRef,
      popperContentRef,
      popperArrowRef
    };
  }
});
</script>

<style lang="scss">

</style>
