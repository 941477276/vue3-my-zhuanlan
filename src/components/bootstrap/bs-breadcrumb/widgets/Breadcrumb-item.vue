<template>
  <li
    class="breadcrumb-item"
    :class="{
      active: lastChildId === id,
      'is-disabled': disabled
    }">
    <span
      class="breadcrumb-item-separator">{{ separator }}</span>
    <component
      :is="isHttpUrl ? 'a': 'span'"
      :href="isHttpUrl ? to : null"
      :target="isHttpUrl ? target : null"
      class="breadcrumb-link"
      :class="{
        'is-link': !!to && (lastChildId !== id)
      }"
      @click="onLinkClick">
      <slot></slot>
    </component>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  computed,
  getCurrentInstance
} from 'vue';
import {
  BreadcrumbContext,
  breadcrumbContextKey
} from '@/ts-tokens/bootstrap/breadcrumb';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
let breadcrumbCount = 0;

export default defineComponent({
  name: 'BreadcrumbItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    },
    replace: { // 是否不将导航在历史记录中留下
      type: Boolean,
      default: false
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    isUrl: { // 是否为普通链接
      type: Boolean,
      default: false
    },
    target: { // a标签的target属性
      type: String,
      default: ''
    }
  },
  setup (props: any) {
    let id = `breadcrumb_item_${++breadcrumbCount}`;
    let { separator, lastChildId } = inject<BreadcrumbContext>(breadcrumbContextKey, {
      separator: ref('/')
    } as BreadcrumbContext);

    let ins = getCurrentInstance();
    let $router = ins && ins.appContext.config.globalProperties.$router;

    let onLinkClick = function () {
      let to = props.to;
      if (!$router || !to || props.disabled) {
        return;
      }
      props.replace ? $router.replace(to) : $router.push(to);
    };

    let urlReg = /^(\w+:\/\/)/;
    let isHttpUrl = computed(function () {
      if (props.isUrl) {
        return;
      }
      return urlReg.test(props.to);
    });

    useDeliverContextToParent<BreadcrumbContext>(breadcrumbContextKey, {
      id
    });

    return {
      id,
      separator,
      lastChildId,
      isHttpUrl,
      onLinkClick
    };
  }
});
</script>
