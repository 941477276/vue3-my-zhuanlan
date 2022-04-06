<template>
  <li
    class="breadcrumb-item"
    :class="{
      active: lastChildId === id,
      'is-disabled': disabled
    }">
    <span
      class="breadcrumb-item-separator">{{ separator }}</span>
    <span
      class="breadcrumb-link"
      :class="{
        'is-link': !!to && (lastChildId !== id)
      }"
      @click="onLinkClick">
      <slot></slot>
    </span>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
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
    }
  },
  setup (props: any) {
    let id = `breadcrumb_item_${++breadcrumbCount}`;
    let { separator, separatorIcon, lastChildId } = inject<BreadcrumbContext>(breadcrumbContextKey, {
      separator: ref('/'),
      separatorIcon: ref('')
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

    useDeliverContextToParent<BreadcrumbContext>(breadcrumbContextKey, {
      id
    });

    return {
      id,
      separator,
      separatorIcon,
      lastChildId,
      onLinkClick
    };
  }
});
</script>

<style lang="scss">
.bs-breadcrumb {
  .breadcrumb-item{
    &::before{
      display: none;
    }
  }
}
.breadcrumb-item-separator{
  float: left;
  padding-right: 0.5rem;
  color: #6c757d;
}
.breadcrumb-link{
  &.is-link{
    color: #007bff;
    cursor: pointer;
  }
}

.breadcrumb-item{
  &:first-child{
    .breadcrumb-item-separator{
      display: none;
    }
  }
  &.is-disabled{
    .breadcrumb-link{
      color: #aaa;
      cursor: not-allowed;
    }
  }
}
</style>
