<template>
  <div
    class="bs-tabs-nav-wrapper"
    :class="[
      `tab-position-${tabPosition}`,
      `trigger-type-${triggerType}`,
      {
        'has-scroll': hiddenTabsCount > 0
      }
    ]">
    <button
      v-if="triggerType === 'button'"
      class="bs-tabs-nav-prev"
      aria-label="tabs nav prev">
      <BsIcon name="chevron-left"></BsIcon>
    </button>
    <slot name="left-extra"></slot>
    <div
      class="bs-tabs-nav-scroller"
      ref="navScrollerRef"
      :style="navScrollerStyle">
      <ul class="bs-tabs-nav" ref="tabsNavRef">
        <BsTabsNavItem
          v-for="item in panes"
          :name="item.name"
          :label="item.label"
          :id="item.id"
          :disabled="item.disabled"
          :item-slot="item.itemSlot"
          :key="item.name"
          @click="onNavItemClick"></BsTabsNavItem>
        <li class="bs-tabs-ink-bar"></li>
      </ul>
    </div>
    <slot name="right-extra"></slot>
    <button
      v-if="triggerType === 'button'"
      class="bs-tabs-nav-next"
      aria-label="tabs nav next">
      <BsIcon name="chevron-right"></BsIcon>
    </button>
    <div
      v-if="triggerType === 'more'"
      class="bs-tabs-nav-operation">
      <BsDropdown trigger="hover">
        <span class="more-btn">
          <BsIcon name="three-dots"></BsIcon>
        </span>
        <template #dropdown-item>
          <bs-dropdown-item>下拉框1</bs-dropdown-item>
          <bs-dropdown-item>下拉框2</bs-dropdown-item>
          <bs-dropdown-item>下拉框3</bs-dropdown-item>
        </template>
      </BsDropdown>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  onMounted
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import BsDropdown from '@/components/bootstrap/bs-dropdown/BsDropdown.vue';
import BsDropdownItem from '@/components/bootstrap/bs-dropdown/widgets/BsDropdownItem.vue';
import BsTabsNavItem from './BsTabsNavItem.vue';
import {
  TabPosition,
  TriggerTypeOnOverflow
} from '@/ts-tokens/bootstrap/tabs';
import { useHiddenTabsInfo } from './useHiddenTabsInfo';

export default defineComponent({
  name: 'BsTabsNav',
  components: {
    BsIcon,
    BsDropdown,
    BsDropdownItem,
    BsTabsNavItem
  },
  props: {
    panes: { // 面板列表
      type: Array,
      default () {
        return [];
      }
    },
    triggerTypeOnOverflow: { // 当标签导航列表宽度超出父容器时选择超出部分标签导航的方式
      type: String as PropType<TriggerTypeOnOverflow>,
      default: 'auto'
    },
    hiddenTabsGreaterThan: { // 当triggerTypeOnOverflow为auto时，隐藏掉的标签导航个数达到该阈值时才会使用'more'
      type: Number,
      default: 5
    },
    tabPosition: { // 标签的位置
      type: String as PropType<TabPosition>,
      default: 'top'
    },
    tabBarMaxHeight: { // 标签导航最大高度
      type: [String, Number],
      default: 0
    }
  },
  emit: ['close', 'click'],
  setup (props: any, ctx: any) {
    let navScrollerRef = ref<HTMLElement|null>(null);
    let tabsNavRef = ref<HTMLElement|null>(null);

    // 滚动容器的样式
    let navScrollerStyle = computed(function () {
      let tabBarMaxHeight = props.tabBarMaxHeight;
      if (props.tabPosition === 'top' || props.tabPosition === 'bottom') {
        return '';
      }
      if (!tabBarMaxHeight) {
        return '';
      }
      if (typeof tabBarMaxHeight === 'number') {
        return `max-height: ${tabBarMaxHeight}px;`;
      }
      return `max-height: ${tabBarMaxHeight}`;
    });

    // 获取隐藏的标签页信息
    let { hiddenTabsCount, isOverflow, hiddenTabs } = useHiddenTabsInfo(props, navScrollerRef, tabsNavRef);
    // 切换隐藏的标签页方式
    let triggerType = computed(function () {
      let propsTriggerType = props.triggerTypeOnOverflow;
      if (propsTriggerType !== 'auto') {
        return propsTriggerType;
      }
      return hiddenTabsCount.value >= props.hiddenTabsGreaterThan ? 'more' : 'button';
    });

    // 激活的tab
    let activeTabId = ref('');
    let onNavItemClick = function (itemName: string) {
      console.log('onNavItemClick', itemName);
    };
    return {
      triggerType,
      hiddenTabsCount,
      navScrollerRef,
      tabsNavRef,
      navScrollerStyle,

      onNavItemClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-tabs-nav";
</style>
