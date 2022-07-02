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
        @click.stop="onSwitcherClick">
        <!--<slot name="switcher-icon" :data="nodeData" :node="{}">
          <i class="bs-tree-node-switcher-arrow" role="img">
            <svg class="switcher-arrow-svg" viewBox="0 0 1024 1024" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>
          </i>
        </slot>-->
        <BsTreeNodeSwitcherIcon v-if="!loadingData" :node-data="nodeData" :node="{}"></BsTreeNodeSwitcherIcon>
        <BsSpinner v-else class="bs-tree-node-spinner" color-type="primary"></BsSpinner>
      </span>
      <BsCheckbox
        v-if="showCheckbox"
        v-model="inputModel"
        :value="nodeValue"
        :indeterminate="isIndeterminate"
        :name="checkboxName"
        :disabled="isDisabled"></BsCheckbox>
      <BsRadio
        v-if="!showCheckbox && showRadio"
        v-model="inputModel"
        :value="nodeValue"
        :name="radioName"
        :disabled="isDisabled"></BsRadio>
      <!--<div class="bs-tree-node-label">node label</div>-->
      <BsTreeNodeLabel
        :label-key="labelKey"
        :node-data="nodeData"
        :render-content="renderContent"
        :node-state="nodeState"></BsTreeNodeLabel>
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
  defineComponent,
  inject,
  onUnmounted
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
import { useTreeNode } from './useTreeNode';

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
    let {
      loadingData,
      dataLoaded,
      isLeaf,
      nodeValue,
      isChecked,
      isCurrent,
      isIndeterminate,
      isDisabled
    } = useTreeNode(props, treeCtx);

    // 节点是否展开
    let isExpand = ref(false);
    let isManualExpanded = ref(false); // 是否为手动展开的
    let isChildrenRendered = ref(!props.renderAfterExpand || props.defaultExpandAll); // 子节点是否已经渲染
    /**
     * 展开或收起节点
     * @param expanded 是否展开
     * @param isManual 是否为用户手动展开
     */
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

    // 分页相关数据
    let { pageCount, nodeChildren, totalPage, showMoreChildNode, showAllChildNode } = useTreePagination(props);

    // 复选框的值
    let inputModel = computed({
      get () {
        // console.log('treeNode,判断复选框是否选中');
        if (props.showCheckbox) {
          return isChecked.value;
        }
        return isChecked.value ? nodeValue.value : '';
      },
      set (newVal) {
        console.log('treeNode,复选框新的值：', newVal);
        if (newVal) {
          treeCtx.addCheckedKey(nodeValue.value, props.nodeData, nodeChildren.value.length > 0);
        } else {
          // radio组件的值改变时不会进入这里，因此不用担心
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
        levelPath: props.nodeLeavePath
        // loaded: false,
        // childNodes: Node[],
        // loading: loadingData.value
      };
    });

    // 动态加载子节点
    let lazyLoadChildren = function () {
      return new Promise(function (resolve) {
        let loadDataFn = props.loadDataFn;
        let children = (props.nodeData[props.childrenKey] || []);
        if (!props.lazy || loadingData.value || dataLoaded.value || isLeaf.value || children.length > 0) {
          console.log('lazyLoadChildren 111');
          resolve(true);
          return;
        }
        if (typeof loadDataFn !== 'function') {
          console.error('loadDataFn is not a function!');
          resolve(true);
          return;
        }
        console.log('lazyLoadChildren 222');
        loadingData.value = true;
        let result = props.loadDataFn(props.nodeData, nodeState.value);
        if (util.isPromise(result)) {
          console.log('lazyLoadChildren 333');
          result.then(function (isLoaded: boolean) {
            console.log('lazyLoadChildren 444');
            loadingData.value = false;
            dataLoaded.value = !!isLoaded;
            resolve(isLoaded);
          }).catch(function () {
            loadingData.value = false;
            console.log('lazyLoadChildren 555');
          });
        } else {
          console.log('lazyLoadChildren 666');
          loadingData.value = false;
          resolve(true);
        }
      });
    };

    // 处理展开/收起按钮点击事件
    let onSwitcherClick = function () {
      if (props.lazy) {
        lazyLoadChildren()
          .then(function () {
            toggleExpand();
          });
      } else {
        toggleExpand();
      }
    };

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
      if (props.lazy) {
        lazyLoadChildren()
          .then(function () {
            toggleExpand();
          });
      } else {
        toggleExpand();
      }
    };

    watch(() => props.expandedKeys, function (expandedKeys) {
      let nodeKey = nodeValue.value;

      if (!isManualExpanded.value) { // 在没有手动操作过的情况下才可以展开/收起
        if (expandedKeys?.includes(nodeKey) || props.defaultExpandAll) {
          if (props.lazy) {
            lazyLoadChildren()
              .then(function () {
                toggleExpand(true, false);
              });
          } else {
            toggleExpand(true, false);
          }
        } else {
          if (isExpand.value) {
            // isExpand.value = false;
            toggleExpand(false, false);
          }
        }
      }
    }, { immediate: true, deep: true });

    onUnmounted(function () {
      treeCtx.onNodeDestroy(props.nodeData);
    });

    return {
      isLeaf,
      isExpand,
      isChildrenRendered,
      isChecked,
      isCurrent,
      isIndeterminate,
      isDisabled,
      dataLoaded,
      nodeChildren,
      nodeValue,
      pageCount,
      totalPage,
      inputModel,
      loadingData,
      nodeState,

      onNodeClick,
      onSwitcherClick,

      toggleExpand,
      showMoreChildNode,
      showAllChildNode
    };
  }
});
</script>

<style lang="scss">
@import "bs-tree-node";
</style>
