<template>
  <div
    class="bs-tree-node"
    :class="{
      'is-expanded': isExpand,
      'is-tree-branch': !isLeaf,
      'is-tree-leaf': isLeaf,
      'is-checked': isChecked,
      'is-current': isCurrent
    }"
    :data-node-leave="nodeLeave">
    <div
      class="bs-tree-node-content"
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
        @click.stop="toggleExpand()">
        <!--<slot name="switcher-icon" :data="nodeData" :node="{}">
          <i class="bs-tree-node-switcher-arrow" role="img">
            <svg class="switcher-arrow-svg" viewBox="0 0 1024 1024" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>
          </i>
        </slot>-->
        <BsTreeNodeSwitcherIcon :node-data="nodeData" :node="{}"></BsTreeNodeSwitcherIcon>
        <BsSpinner v-if="false" class="bs-tree-node-spinner" color-type="primary"></BsSpinner>
      </span>
      <BsCheckbox
        v-if="showCheckbox"
        v-model="checkboxModel"
        :value="nodeValue"
        :indeterminate="isIndeterminate"></BsCheckbox>
      <BsRadio v-if="!showCheckbox && showRadio"></BsRadio>
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
        <template v-if="nodeChildren.length > 0">
          <BsTreeNode
            v-for="(childNode, index) in nodeChildren"
            v-bind="$props"
            :key="childNode[nodeKey]"
            :node-leave="nodeLeave + 1"
            :node-data="childNode"
            :node-leave-path="`${nodeLeavePath}_${index + 1}`"
            :parent-node-leave-path="nodeLeavePath"></BsTreeNode>
          <!--<div
            v-if="pageSize > 0 && totalPage > 0"
            class="bs-tree-node-children-operate"
            :class="{
              'is-disabled': pageCount >= totalPage
            }">
            <span class="bs-tree-node-indent" aria-hidden="true">
              <template v-if="(nodeLeave) > 0">
                <span
                  class="bs-tree-node-indent-item"
                  v-for="item in (nodeLeave)"
                  :key="`indent_item2-${item}`"></span>
              </template>
            </span>
            <span
              role="button"
              class="bs-tree-node-switcher bs-tree-node-switcher-noop">
              <BsTreeNodeSwitcherIcon :node-data="nodeData" :node="{}"></BsTreeNodeSwitcherIcon>
            </span>
            <span
              class="bs-tree-node-loadmore"
              @click="showMoreChildNode">{{ loadMoreChildButtonText }}</span>
            <i class="tree-node-split-line">/</i>
            <span
              class="bs-tree-node-loadmore"
              @click="showAllChildNode">{{ loadAllChildButtonText }}</span>
          </div>-->
          <BsTreeNodeOperate
            v-if="pageSize > 0 && totalPage > 0"
            :disabled="pageCount >= totalPage"
            :node-data="nodeData"
            :node-level="nodeLeave"
            :load-more-child-button-text="loadMoreChildButtonText"
            :load-all-child-button-text="loadAllChildButtonText"
            @show-more="showMoreChildNode"
            @show-all="showAllChildNode"></BsTreeNodeOperate>
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
  defineComponent, inject
} from 'vue';
import BsCheckbox from '@/components/bootstrap/bs-checkbox/BsCheckbox.vue';
import BsRadio from '@/components/bootstrap/bs-radio/BsRadio.vue';
import BsSpinner from '@/components/bootstrap/bs-spinner/BsSpinner.vue';
import BsTreeNodeLabel from './BsTreeNodeLabel.vue';
import BsTreeNodeSwitcherIcon from './BsTreeNodeSwitcherIcon.vue';
import BsTreeNodeOperate from './BsTreeNodeOperate.vue';
import BsCollapseTransition from '../../bs-collapse-transition/BsCollapseTransition.vue';
import { bsTreeContextKey, TreeContext } from '@/ts-tokens/bootstrap/tree';
import { useTreePagination } from '../useTreePagination';
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
    BsTreeNodeOperate,
    BsCollapseTransition
  },
  props: {
    ...bsTreeProps,
    ...bsTreeNodeProps
  },
  inheritAttrs: false,
  emit: ['node-expand'],
  setup (props: any, ctx:any) {
    const treeCtx = inject<TreeContext>(bsTreeContextKey)!;

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
    // 是否选中
    let isChecked = computed(function () {
      // console.log('props.checkedKeys', props.checkedKeys, nodeValue.value);
      return props.checkedKeys?.includes(nodeValue.value);
    });
    // 判断当前节点是否被点击
    let isCurrent = computed(function () {
      let currentNode = treeCtx.currentNode.value;
      if (!currentNode) {
        return false;
      }
      return nodeValue.value === currentNode[props.nodeKey];
    });
    // 是否为半选中状态
    let isIndeterminate = computed(function () {
      return treeCtx.halfCheckedKeys.value.includes(nodeValue.value);
    });

    // 节点是否展开
    let isExpand = ref(props.defaultExpandAll || false);
    let isManualExpanded = ref(false); // 是否为手动展开的
    let isChildrenRendered = ref(!props.renderAfterExpand || props.defaultExpandAll); // 子节点是否已经渲染
    let toggleExpand = function (expanded?: boolean|undefined, isManual = true) {
      if (isLeaf.value) {
        return;
      }
      isManualExpanded.value = !!isManual;
      expanded = typeof expanded == 'boolean' ? expanded : !isExpand.value;
      if (!expanded) {
        isExpand.value = false;
        treeCtx.onNodeExpand(false, props.nodeData, { ...nodeState.value });
      } else {
        if (!isChildrenRendered.value) {
          isChildrenRendered.value = true;
          nextTick(function () {
            isExpand.value = true;
            treeCtx.onNodeExpand(true, props.nodeData, { ...nodeState.value });
          });
        } else {
          isExpand.value = true;
          treeCtx.onNodeExpand(true, props.nodeData, { ...nodeState.value });
        }
      }
    };
    watch(() => props.expandedKeys, function (expandedKeys) {
      let nodeKey = nodeValue.value;

      if (expandedKeys?.includes(nodeKey)) {
        toggleExpand(true, false);
      } else {
        if (isExpand.value && !isManualExpanded.value) {
          // isExpand.value = false;
          toggleExpand(false, false);
        }
      }
    }, { immediate: true, deep: true });

    // 分页相关数据
    let { pageCount, nodeChildren, totalPage, showMoreChildNode, showAllChildNode } = useTreePagination(props);
    /* // 当前页码
    let pageCount = ref(1);
    // 子节点
    let nodeChildren = computed(function () {
      let children = props.nodeData[props.childrenKey] || [];
      let pageSize = Math.ceil(props.pageSize);
      if (!isNaN(pageSize) && pageSize > 0 && children.length > pageSize) {
        return children.slice(0, pageCount.value * pageSize);
      }

      return children;
    });
    // 总页数
    let totalPage = computed(function () {
      let children = props.nodeData[props.childrenKey] || [];

      let pageSize = Math.ceil(props.pageSize);
      if (!isNaN(pageSize) && pageSize > 0 && children.length > pageSize) {
        return Math.ceil(children.length / pageSize);
      }
      return 0;
    });
    // 显示更多子节点
    let showMoreChildNode = function () {
      if (props.pageSize <= 0 && pageCount.value >= totalPage.value) {
        return;
      }
      pageCount.value++;
    };
 */
    // 复选框的值
    let checkboxModel = computed({
      get () {
        // console.log('treeNode,判断复选框是否选中');
        return isChecked.value;
      },
      set (newVal) {
        // console.log('treeNode,复选框新的值：', newVal);
        if (newVal) {
          treeCtx.addCheckedKey(nodeValue.value, props.nodeData, nodeChildren.value.length > 0);
        } else {
          treeCtx.removeCheckedKey(nodeValue.value, props.nodeData, nodeChildren.value.length > 0);
        }
      }
    });

    // 节点状态
    let nodeState = computed(function () {
      return {
        // id: number
        // text: string,
        nodeKey: props.nodeKey,
        checked: isChecked.value,
        indeterminate: isIndeterminate.value,
        data: props.nodeData,
        expanded: isExpand.value,
        // parent: Node,
        // visible: boolean,
        isCurrent: isCurrent.value,
        pageCount: pageCount.value,
        totalPage: totalPage.value,
        // store: TreeStore,
        isLeafByUser: false,
        isLeaf: false,
        // canFocus: boolean,
        level: props.nodeLeave,
        levelPath: props.nodeLeavePath,
        loaded: false,
        // childNodes: Node[],
        loading: false
      };
    });

    /* // 显示所有子节点
    let showAllChildNode = function () {
      if (props.pageSize <= 0) {
        return;
      }
      pageCount.value = totalPage.value;
    }; */

    // 节点点击事件
    let onNodeClick = function (evt: MouseEvent) {
      let target = evt.target as HTMLElement;
      let nodeData = props.nodeData;

      treeCtx.currentNode.value = nodeData;
      treeCtx.onNodeClick(nodeData, { ...nodeState.value });
      if (target?.nodeName === 'INPUT' || !props.expandOnClickNode) {
        return;
      }
      if (util.hasClass(target, 'bs-checkbox') || util.parents(target, 'bs-checkbox') || util.hasClass(target, 'bs-radio') || util.parents(target, 'bs-radio')) {
        return;
      }
      console.log(111, target);
      toggleExpand();
    };

    return {
      isLeaf,
      isExpand,
      isChildrenRendered,
      isChecked,
      isCurrent,
      isIndeterminate,
      nodeChildren,
      nodeValue,
      pageCount,
      totalPage,
      checkboxModel,

      toggleExpand,
      onNodeClick,
      showMoreChildNode,
      showAllChildNode
      // onNodeSwitcherClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-tree-node";
</style>
