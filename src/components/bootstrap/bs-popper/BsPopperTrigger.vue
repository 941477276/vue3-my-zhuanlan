<template>
  <BsOnlyChild
    v-bind="$attrs"
    v-if="!virtualTriggering">
    <slot></slot>
  </BsOnlyChild>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  PropType,
  watch,
  inject,
  nextTick,
  onUnmounted
} from 'vue';
import BsOnlyChild from '../bs-slot/BsOnlyChild.vue';
import {
  bsPopperContextKey,
  BsPopperContext
} from '@/ts-tokens/bootstrap/popper';

export default defineComponent({
  name: 'BsPopperTrigger',
  components: {
    BsOnlyChild
  },
  props: {
    virtualTriggering: { // 是否由虚拟元素触发
      type: Boolean,
      default: false
    },
    virtualRef: { // 触发元素的ref
      type: [String, Function, Object],
      default: null
    }
  },
  setup (props: any, ctx: any) {
    let { triggerRef } = inject<BsPopperContext>(bsPopperContextKey, {} as BsPopperContext)!;
    // 如果使用虚拟元素触发，则在这里更新父组件的triggerRef变量
    let stopWatch = watch(() => props.virtualRef, function (el: HTMLElement|string|(() => HTMLElement)) {
      if (el && triggerRef) {
        let type = typeof el;
        console.log('type', type);
        if (type === 'string') {
          // 如果传递的是一个字符串（css选择器），则需在dom更新后再去获取dom，这里使用nextTick函数是一样的
          setTimeout(function () {
            triggerRef.value = document.querySelector(el as string);
          }, 0);
        } else if (type === 'function') {
          // 如果传递的是一个函数，则需在dom更新后再去获取dom，这里使用nextTick函数是一样的
          setTimeout(function () {
            triggerRef.value = (el as () => HTMLElement)();
          }, 0);
        } else {
          triggerRef.value = el as HTMLElement;
        }
      }
    }, { immediate: true });

    onUnmounted(function () {
      stopWatch();
    });
  }
});
</script>

<style lang="scss">

</style>
