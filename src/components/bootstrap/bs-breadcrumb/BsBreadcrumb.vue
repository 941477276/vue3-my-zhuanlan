<template>
  <ol
    class="bs-breadcrumb breadcrumb"
    aria-label="breadcrumb">
    <slot></slot>
  </ol>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  Component,
  provide,
  toRef,
  ref,
  computed
} from 'vue';
import {
  BreadcrumbContext,
  breadcrumbContextKey
} from '@/ts-tokens/bootstrap/breadcrumb';

type ItemCtx = {
  id: string;
  [key: string]: any;
}

export default defineComponent({
  name: 'BsBreadcrumb',
  props: {
    separator: {
      type: String,
      default: '/'
    },
    separatorIcon: {
      type: [String, Function, Object] as PropType<string|Component>,
      default: ''
    }
  },
  setup (props: any) {
    let itemCtxs = ref<ItemCtx[]>([]);
    // 存储子组件上下文
    let addChildComponentContext = function (childContext: ItemCtx) {
      let index = itemCtxs.value.findIndex(item => item.id === childContext.id);
      if (index > -1) {
        return;
      }
      itemCtxs.value.push(childContext);
    };
    // 移除子组件上下文
    let removeChildComponentContext = function (childContext: ItemCtx) {
      let index = itemCtxs.value.findIndex(item => item.id === childContext.id);
      if (index === -1) {
        return;
      }
      itemCtxs.value.splice(index, 1);
    };
    let lastChildId = computed(function () {
      let arr = itemCtxs.value;
      if (arr.length > 0) {
        return arr[arr.length - 1].id;
      }
      return null;
    });

    provide<BreadcrumbContext>(breadcrumbContextKey, {
      separator: toRef(props, 'separator'),
      separatorIcon: toRef(props, 'separatorIcon'),
      lastChildId,
      addChildComponentContext,
      removeChildComponentContext
    });
  }
});
</script>

<style lang="scss">

</style>
