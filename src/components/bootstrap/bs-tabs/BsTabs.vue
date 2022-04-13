<template>
<div
  class="bs-tabs"
  :class="[
    `bs-tabs-${tabPosition}`
  ]">
  <div class="bs-tabs-header">
    <BsTabsNav
      :tab-position="tabPosition"
      :panes="panes"
      :trigger-type-on-overflow="triggerTypeOnOverflow"
      :hidden-tabs-greater-than="hiddenTabsGreaterThan"
      :tab-bar-max-height="tabBarMaxHeight"></BsTabsNav>
  </div>
  <div class="bs-tabs-body">
    标签页内容
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  onMounted,
  h
} from 'vue';
import BsTabsNav from './widgets/BsTabsNav.vue';
import {
  TabPosition,
  TriggerTypeOnOverflow
} from '@/ts-tokens/bootstrap/tabs';

export default defineComponent({
  name: 'BsTabs',
  components: {
    BsTabsNav
  },
  props: {
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
    }
  },
  emit: ['close', 'click'],
  setup (props: any, ctx: any) {
    let panes = ref([
      { name: 'tag_1', id: 'tab_1', label: '标签一', itemSlot: null, disabled: false },
      { name: 'tag_2', id: 'tab_2', label: '文章管理', itemSlot: null, disabled: true },
      { name: 'tag_3', id: 'tab_3', label: '文章分类管理', itemSlot: () => h('strong', '文章分类管理'), disabled: false },
      { name: 'tag_4', id: 'tab_4', label: '文章关键词管理', itemSlot: null, disabled: false },
      { name: 'tag_5', id: 'tab_5', label: '用户管理', itemSlot: null, disabled: false },
      { name: 'tag_6', id: 'tab_6', label: '标识管理', itemSlot: null, disabled: false },
      { name: 'tag_7', id: 'tab_7', label: '机构管理', itemSlot: null, disabled: false },
      { name: 'tag_8', id: 'tab_8', label: '策略管理', itemSlot: null, disabled: false },
      { name: 'tag_9', id: 'tab_9', label: 'vpn管理', itemSlot: null, disabled: false },
      { name: 'tag_10', id: 'tab_10', label: '应用发布管理', itemSlot: null, disabled: false }
    ]);
    return {
      panes
    };
  }
});
</script>

<style lang="scss">
@import "bs-tabs";
</style>
