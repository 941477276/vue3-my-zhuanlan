<template>
<slot></slot>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  provide,
  ref,
  watch,
  onMounted,
  onUnmounted
} from 'vue';
import {
  ForwardRefContext,
  useForwardRef
} from '@/hooks/useForwardRef';
import {
  BsPopperContext,
  bsPopperContextKey
} from '@/ts-tokens/bootstrap/popper';
import { bsPopperProps } from './bs-popper-props';
import {
  createPopper,
  Placement,
  Instance as PopperInstance
} from '@popperjs/core';

export default defineComponent({
  name: 'BsPopper',
  props: bsPopperProps,
  setup (props: any, ctx: any) {
    // 触发popper的元素
    let triggerRef = ref<HTMLElement|null>(null);
    // popper内容元素
    let popperContentRef = ref<HTMLElement|null>(null);
    // popper三角箭头元素
    let popperArrowRef = ref<HTMLElement|null>(null);
    // popper实例
    let popperInstance = ref<PopperInstance>();

    // 向子孙组件传递（透传）触发popper元素的变量,让子孙组件去更新这个变量
    useForwardRef(triggerRef);

    provide<BsPopperContext>(bsPopperContextKey, {
      triggerRef,
      popperContentRef,
      popperArrowRef,
      popperInstance
    });

    let stopWatchRef: () => void;
    onMounted(function () {
      console.log(111);
      stopWatchRef = watch([triggerRef, popperContentRef], ([triggerEl, popperContentEl]) => {
        if (!popperInstance.value) {
          console.log('popperInstance.value', popperInstance.value);
          if (!triggerEl || !popperContentEl) {
            return;
          }
          console.log('newEl', triggerEl, popperContentEl);
          popperInstance.value = createPopper(triggerEl as Element, popperContentEl as HTMLElement, {
            placement: props.placement,
            modifiers: [
              { // 偏移量
                name: 'offset',
                options: {
                  offset: [0, 8]
                }
              },
              { // 箭头
                name: 'arrow',
                options: {
                  element: popperArrowRef.value,
                  padding: 5
                }
              }
            ]
          });
          console.log('popperInstance.value', popperInstance.value);
        }
      }, { immediate: true });
    });

    onUnmounted(function () {
      stopWatchRef();
    });

    return {
      triggerRef,
      popperContentRef,
      popperArrowRef,
      popperInstance
    };
  }
});
</script>

<style lang="scss">
@import "bs-popper";
</style>
