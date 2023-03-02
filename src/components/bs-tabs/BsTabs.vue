<template>
<div
  class="bs-tabs"
  :class="[
    `bs-tabs-${tabPosition || 'top'}`
  ]">
  <div class="bs-tabs-header">
    <BsTabsNav
      v-if="panes.length > 0"
      :active-tab-name="modelValue"
      :tab-position="tabPosition || 'top'"
      :panes="panes"
      :trigger-type-on-overflow="triggerTypeOnOverflow"
      :hidden-tabs-greater-than="hiddenTabsGreaterThan"
      :tab-bar-max-height="tabBarMaxHeight"
      :ink-bar-space-between="inkBarSpaceBetween"
      :closeable="closeable"
      @change-active-tab="onActiveTabChange"
      @close="onClose"></BsTabsNav>
  </div>
  <div class="bs-tabs-body">
    <slot></slot>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  onMounted,
  h,
  provide, computed
} from 'vue';
import BsTabsNav from './widgets/BsTabsNav.vue';
import {
  TabNavItem,
  TabPosition,
  TriggerTypeOnOverflow,
  TabsPaneContext,
  TabsContext,
  bsTabsContextKey
} from '../../ts-tokens/bootstrap/tabs';

export default defineComponent({
  name: 'BsTabs',
  components: {
    BsTabsNav
  },
  props: {
    modelValue: { // 绑定值，选中选项卡的 name
      type: String,
      default: ''
    },
    tabPosition: { // 标签的位置
      type: String as PropType<TabPosition>,
      default: 'top'
    },
    triggerTypeOnOverflow: { // 当标签导航列表宽度超出父容器时选择超出部分标签导航的方式
      type: String as PropType<TriggerTypeOnOverflow>,
      default: 'auto'
    },
    hiddenTabsGreaterThan: { // 当triggerTypeOnOverflow为auto时，隐藏掉的标签导航个数达到该阈值时才会使用'more'
      type: Number,
      default: 10
    },
    tabBarMaxHeight: { // 标签导航最大高度
      type: [String, Number],
      default: 0
    },
    inkBarSpaceBetween: { // 标签导航高亮条向两端延伸的长度
      type: Number,
      default: 0
    },
    closeable: { // 是否可关闭
      type: Boolean,
      default: false
    }
  },
  emit: ['close', 'click'],
  setup (props: any, ctx: any) {
    let activeTabId = ref('');
    // <bs-tabs-pane> 子组件上下文
    let tabsPanArr = ref<TabsPaneContext[]>([]);
    let panes = computed<TabNavItem[]>(function () {
      return tabsPanArr.value.map(tabsPaneCtx => {
        return {
          name: tabsPaneCtx.name,
          label: tabsPaneCtx.label,
          disabled: tabsPaneCtx.disabled,
          closeable: tabsPaneCtx.closeable,
          id: `tab_item-${tabsPaneCtx.index}`,
          itemSlot: tabsPaneCtx.labelSlot.label
        };
      });
    });
    let onActiveTabChange = function (activeTab: TabNavItem) {
      // console.log('active tab changed', activeTab);
      if (activeTab.id === activeTabId.value) {
        return;
      }
      activeTabId.value = activeTab.id;
      ctx.emit('update:modelValue', activeTab.name);
    };

    let changeActiveTab = function (activeTabName: string) {
      let pane = panes.value.find(item => item.name === activeTabName);
      if (!pane || pane.id == activeTabId.value) {
        return;
      }
      activeTabId.value = pane.id;
      ctx.emit('update:modelValue', pane.name);
    };

    // 存储子组件上下文
    let addChildComponentContext = function (childContext: TabsPaneContext) {
      let index = tabsPanArr.value.findIndex(item => item.id === childContext.id);
      if (index == -1) {
        tabsPanArr.value.push(childContext);
      }
    };
    // 移除子组件上下文
    let removeChildComponentContext = function (childContext: TabsPaneContext) {
      let index = tabsPanArr.value.findIndex(item => item.id === childContext.id);
      if (index != -1) {
        tabsPanArr.value.splice(index, 1);
      }
    };

    let onClose = function (tabInfo: {id: string; name: string;}) {
      ctx.emit('close', tabInfo.name);
    };

    // 向子孙组件提供上下文数据
    provide<TabsContext>(bsTabsContextKey, {
      activeTabId,
      addChildComponentContext,
      removeChildComponentContext
    });

    return {
      activeTabId,
      panes,
      tabsPanArr,

      changeActiveTab,
      onActiveTabChange,
      onClose
    };
  }
});
</script>

<style lang="scss">
@import "bs-tabs";
</style>
