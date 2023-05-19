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
} from '../../../ts-tokens/bootstrap/breadcrumb';
import { useDeliverContextToParent } from '../../../hooks/useDeliverContextToParent';
import { bsBreadcrumbItemProps } from '../bs-breadcrumb-types';

let breadcrumbCount = 0;

export default defineComponent({
  name: 'BreadcrumbItem',
  props: bsBreadcrumbItemProps,
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
