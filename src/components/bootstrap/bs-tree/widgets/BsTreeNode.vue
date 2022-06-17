<template>
  <div
    class="bs-tree-node"
    :class="{
      'is-expanded': isExpand
    }"
    :data-node-leave="nodeLeave">
    <div
      class="bs-tree-node-content"
      :class="{
        'is-tree-branch': !isLeaf,
        'is-tree-leaf': isLeaf
      }"
      @click="onNodeClick">
      <span class="bs-tree-node-indent" aria-hidden="true">
        <template v-if="(nodeLeave - 1) > 0">
          <span
            class="bs-tree-node-indent-item"
            v-for="item in (nodeLeave - 1)"
            :key="`indent_item-${item}`"></span>
        </template>
      </span>
      <span
        role="button"
        class="bs-tree-node-switcher"
        :class="{
          'bs-tree-node-switcher-noop': isLeaf,
          'bs-tree-node-switcher-open': isExpand
        }"
        @click.stop="toggleExpand">
        <!--<slot name="switcher-icon" :data="nodeData" :node="{}">
          <i class="bs-tree-node-switcher-arrow" role="img">
            <svg class="switcher-arrow-svg" viewBox="0 0 1024 1024" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>
          </i>
        </slot>-->
        <BsTreeNodeSwitcherIcon :node-data="nodeData" :node="{}"></BsTreeNodeSwitcherIcon>
        <BsSpinner v-if="false" class="bs-tree-node-spinner" color-type="primary"></BsSpinner>
      </span>
      <BsCheckbox v-if="false"></BsCheckbox>
      <BsRadio v-if="false"></BsRadio>
      <!--<div class="bs-tree-node-label">node label</div>-->
      <BsTreeNodeLabel
        :label-key="labelKey"
        :node-data="nodeData"
        :render-content="renderContent"
        :node="{}"></BsTreeNodeLabel>
    </div>
    <BsCollapseTransition v-if="isChildrenRendered">
      <div
        v-show="isExpand"
        class="bs-tree-node-children">
        <template v-if="nodeData[childrenKey] && nodeData[childrenKey]?.length > 0">
          <BsTreeNode
            v-for="childNode in nodeData[childrenKey]"
            v-bind="$props"
            :key="childNode[nodeKey]"
            :node-leave="nodeLeave + 1"
            :node-data="childNode"></BsTreeNode>
        </template>
      </div>
    </BsCollapseTransition>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  defineComponent
} from 'vue';
import BsCheckbox from '@/components/bootstrap/bs-checkbox/BsCheckbox.vue';
import BsRadio from '@/components/bootstrap/bs-radio/BsRadio.vue';
import BsSpinner from '@/components/bootstrap/bs-spinner/BsSpinner.vue';
import BsTreeNodeLabel from './BsTreeNodeLabel.vue';
import BsTreeNodeSwitcherIcon from './BsTreeNodeSwitcherIcon.vue';
import BsCollapseTransition from '../../bs-collapse-transition/BsCollapseTransition.vue';
import { bsTreeProps } from '../bs-tree-props';
import { bsTreeNodeProps } from './bs-tree-node-props';
import { util } from '@/common/util';

export default defineComponent({
  name: 'BsTreeNode',
  components: {
    BsCheckbox,
    BsRadio,
    BsSpinner,
    BsTreeNodeLabel,
    BsTreeNodeSwitcherIcon,
    BsCollapseTransition
  },
  props: {
    ...bsTreeProps,
    ...bsTreeNodeProps
  },
  inheritAttrs: false,
  setup (props: any, ctx:any) {
    // 判断当前节点是否为叶子节点
    let isLeaf = computed(function () {
      let nodeData = props.nodeData;
      let isLeafInData = nodeData[props.isLeafKey];
      if (isLeafInData) {
        return true;
      }
      return (nodeData[props.childrenKey]?.length || 0) == 0;
    });

    // 节点的值
    let nodeValue = computed(function () {
      return props.nodeData[props.nodeKey];
    });

    // 节点是否展开
    let isExpand = ref(false);
    let isManualExpanded = ref(false); // 是否为手动展开的
    let isChildrenRendered = ref(false); // 子节点是否已经渲染
    let toggleExpand = function () {
      isManualExpanded.value = true;
      if (isExpand.value) {
        isExpand.value = false;
      } else {
        if (!isChildrenRendered.value) {
          isChildrenRendered.value = true;
          nextTick(function () {
            isExpand.value = true;
          });
        } else {
          isExpand.value = true;
        }
      }
    };
    watch(() => props.defaultExpandedKeys, function (defaultExpandedKeys) {
      let nodeKey = nodeValue.value;
      if (defaultExpandedKeys?.includes(nodeKey)) {
        if (!isChildrenRendered.value) {
          isChildrenRendered.value = true;
          nextTick(function () {
            isExpand.value = true;
          });
        } else {
          isExpand.value = true;
        }
      } else {
        if (isExpand.value && !isManualExpanded.value) {
          isExpand.value = false;
        }
      }
    }, { immediate: true, deep: true });

    // 节点点击事件
    let onNodeClick = function (evt: MouseEvent) {
      let target = evt.target as HTMLElement;
      if (target?.nodeName === 'INPUT' || !props.expandOnClickNode) {
        return;
      }
      if (util.hasClass(target, 'bs-checkbox') || util.parents(target, 'bs-checkbox') || util.hasClass(target, 'bs-radio') || util.parents(target, 'bs-radio')) {
        return;
      }
      console.log(111, target);
      toggleExpand();
    };

    /* // 节点展开/收缩开关点击事件
    let onNodeSwitcherClick = function () {
      console.log(222);
      toggleExpand();
    }; */

    return {
      isLeaf,
      isExpand,
      isChildrenRendered,

      toggleExpand,
      onNodeClick
      // onNodeSwitcherClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-tree-node";
</style>
