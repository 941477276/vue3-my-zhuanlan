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
      :style="navScrollerStyle"
      @wheel.stop.prevent="onScroll">
      <ul class="bs-tabs-nav" ref="tabsNavRef">
        <BsTabsNavItem
          v-for="item in panes"
          :name="item.name"
          :label="item.label"
          :id="item.id"
          :active-tab-id="activeTabId"
          :disabled="item.disabled"
          :item-slot="item.itemSlot"
          :key="item.name || item.id"
          @click="onNavItemClick"></BsTabsNavItem>
        <li class="bs-tabs-ink-bar" ref="inkBarRef"></li>
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
import { useActiveTab } from './useActiveTab';
import { useTabsNavMove } from './useTabsNavMove';
import { useNavScrollerScroll } from './useNavScrollerScroll';

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
      required: true,
      default () {
        return [];
      }
    },
    activeTabName: { // 当前激活的标签导航名称
      type: String,
      default: ''
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
    },
    inkBarSpaceBetween: { // 标签导航高亮条向两端延伸的长度
      type: Number,
      default: 0
    }
  },
  emit: ['close', 'click', 'changeActiveTab'],
  setup (props: any, ctx: any) {
    let navScrollerRef = ref<HTMLElement|null>(null);
    let tabsNavRef = ref<HTMLElement|null>(null);
    let inkBarRef = ref<HTMLElement|null>(null);

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

    // 计算隐藏的标签页信息
    let { hiddenTabsCount, isOverflow, hiddenTabs } = useHiddenTabsInfo(props, navScrollerRef, tabsNavRef);
    // 计算切换隐藏的标签页方式
    let triggerType = computed(function () {
      let propsTriggerType = props.triggerTypeOnOverflow;
      if (propsTriggerType !== 'auto') {
        return propsTriggerType;
      }
      return hiddenTabsCount.value >= props.hiddenTabsGreaterThan ? 'more' : 'button';
    });
    // 计算当前激活的标签导航信息
    let { activeTabId, onNavItemClick } = useActiveTab(props, tabsNavRef, inkBarRef);
    // 标签导航移动
    useTabsNavMove(props, navScrollerRef, tabsNavRef, inkBarRef, activeTabId, hiddenTabs);
    // 标签导航滚动事件
    let onScroll = useNavScrollerScroll(navScrollerRef, tabsNavRef);

    return {
      navScrollerRef,
      tabsNavRef,
      inkBarRef,

      activeTabId,
      triggerType,
      hiddenTabsCount,
      navScrollerStyle,

      onNavItemClick,
      onScroll
    };
  }
});
</script>

<style lang="scss">
@import "bs-tabs-nav";
</style>
