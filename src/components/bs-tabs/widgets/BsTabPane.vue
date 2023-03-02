<template>
  <div
    v-if="!lazy || displayed || active"
    v-show="active"
    class="bs-tab-pane"
    :data-id="id">
    <slot v-if="contentDisplay"></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  h,
  ref,
  toRef,
  computed,
  watch,
  inject,
  onMounted
} from 'vue';
import {
  TabsContext,
  TabsPaneContext,
  bsTabsContextKey
} from '../../../ts-tokens/bootstrap/tabs';
import { useDeliverContextToParent } from '../../../hooks/useDeliverContextToParent';

let bsTabsPaneCount = 0;
export default defineComponent({
  name: 'BsTabPane',
  props: {
    label: { // 选项卡标题
      type: String,
      default: ''
    },
    name: { // 与选项卡绑定值 modelValue 对应的标识符，表示选项卡别名
      type: String,
      default: ''
    },
    closeable: { // 是否可关闭
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    lazy: { // 选项卡内容是否延迟渲染
      type: Boolean,
      default: false
    },
    contentLazyRender: { // 内容延迟渲染，只有在第一次选中后才会被渲染
      type: Boolean,
      default: true
    }
  },
  setup (props: any, ctx: any) {
    let index = ++bsTabsPaneCount;
    let id = `bs_tabs_pane-${index}`;
    useDeliverContextToParent<TabsContext>(bsTabsContextKey, {
      id,
      index,
      label: toRef(props, 'label'),
      name: toRef(props, 'name'),
      disabled: toRef(props, 'disabled'),
      closeable: toRef(props, 'closeable'),
      labelSlot: ctx.slots
    });

    let displayed = ref(false);

    let tabsContext = inject<TabsContext>(bsTabsContextKey) as TabsContext;

    // 计算tab是否选中
    let active = computed(function () {
      let activeTabId = tabsContext.activeTabId.value;
      if (!activeTabId) {
        return false;
      }
      let activeTabIdIndex = Number(activeTabId.split('-')[1]);
      // console.log('activeTabIdIndex', activeTabIdIndex);
      let flag = activeTabIdIndex === index;
      return flag;
    });

    let contentDisplay = computed(function () {
      if (!props.contentLazyRender) {
        return true;
      }
      return displayed.value;
    });

    let stopWatchActive = watch(active, function (newActive) {
      if (newActive) {
        displayed.value = true;
        stopWatchActive();
      }
    });

    return {
      displayed,
      id,
      active,
      contentDisplay
    };
  }
});
</script>
