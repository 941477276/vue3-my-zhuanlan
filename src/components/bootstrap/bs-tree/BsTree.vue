<template>
  <div
    class="bs-tree"
    :class="{
      'bs-tree-highlight-current': highlightCurrent
    }"
    role="tree">
    <BsTreeNode
      v-for="(nodeItem, index) in nodeChildren"
      v-bind="$props"
      v-show="typeof nodeItem._nodeShow == 'boolean' ? nodeItem._nodeShow : true"
      :node-data="nodeItem"
      :key="nodeItem[nodeKey]"
      :node-leave="1"
      :node-leave-path="`${index + 1}`"
      :label-key="props.label"
      :disabled-key="props.disabled"
      :children-key="props.children"
      :is-leaf-key="props.isLeaf"
      :expanded-keys="expandedKeysRoot"
      :checked-keys="checkedKeysRoot"
      :radio-name="radioNameRoot"></BsTreeNode>
    <BsTreeNodeOperate
      v-if="pageSize > 0 && totalPage > 0"
      :node-level="1"
      :node-data="{
        rootTree: true,
        [props.children]: treeData
      }"
      :disabled="pageCount >= totalPage"
      :load-more-child-button-text="loadMoreChildButtonText"
      :load-all-child-button-text="loadAllChildButtonText"
      :show-switcher="false"
      @show-more="showMoreChildNode"
      @show-all="showAllChildNode"></BsTreeNodeOperate>
    <div class="bs-tree-empty" v-if="false">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, watch, toRef, computed } from 'vue';
import BsTreeNode from './widgets/BsTreeNode.vue';
import BsTreeNodeOperate from './widgets/BsTreeNodeOperate.vue';
import { bsTreeProps } from './bs-tree-props';
import { BsNodeData, BsNodeInfo, bsTreeContextKey, TreeContext } from '@/ts-tokens/bootstrap/tree';
import { StringKeyObject } from '@/ts-tokens/bootstrap';
import {
  findChildrenWhichHasChildren2,
  findNodeInfoByValue2,
  findParentsByNodeLevelPath2,
  findParentsByNodeValue2,
  findTopParentByNodeValue2,
  treeDataToFlattarnArr2,
  findChildrenInfoFlattarnByNodeValue2
} from './bs-tree-utils';
import { useTreePagination } from './useTreePagination';

let treeCount = 0;
export default defineComponent({
  name: 'BsTree',
  components: {
    BsTreeNode,
    BsTreeNodeOperate
  },
  props: {
    ...bsTreeProps,
    treeData: { // 树数据
      type: Object,
      default () {
        return {};
      }
    },
    props: { // 树节点配置
      type: Object,
      default () {
        return {
          label: 'label',
          children: 'children',
          disabled: 'disabled',
          isLeaf: 'isLeaf'
        };
      }
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  },
  emits: ['node-expand', 'check-change', 'node-click', 'update:checkedKeys', 'node-destroy'],
  setup (props: any, ctx: any) {
    console.time('Tree组件Script执行耗时：');
    let treeId = `bs_tree-${++treeCount}`;
    // 扁平的树对象
    // let flatTreeMap = ref<BsNodeInfo[]>([]);
    // 扁平化的树信息
    let flatTreeNodeInfoArr = ref<BsNodeInfo[]>([]);

    // 展开的节点的key数组
    let expandedKeysRoot = ref(props.expandedKeys);
    let addExpandedKey = function (nodeKey: string | number) {
      if (!expandedKeysRoot.value.includes(nodeKey)) {
        expandedKeysRoot.value.push(nodeKey);
      }
    };
    let removeExpandedKey = function (nodeKey: string | number) {
      let index = expandedKeysRoot.value.findIndex((item: any) => item === nodeKey);
      if (index > -1) {
        expandedKeysRoot.value.splice(index, 1);
      }
    };

    // 选中节点的key数组
    // let checkedKeysRoot = ref([...props.checkedKeys]);
    let checkedKeysRoot = ref<(string | number)[]>([]);
    // 有子节点且选中的被禁用的节点的key数组
    let checkedKeysDisabledWhichIsParent = ref<(string | number)[]>([]);
    // 半选中状态节点的key数组
    let halfCheckedKeys = ref<(string | number)[]>([]);
    let addCheckedKey = function (nodeKey: string | number, isDisabled: boolean) {
      if (isDisabled) {
        console.log('addCheckedKey，节点为禁用的，', nodeKey);
        let nodeInfo = findNodeInfoByValue2(nodeKey, props.nodeKey, flatTreeNodeInfoArr.value);
        // 如果被禁用的节点没有子节点，则不添加进去
        if (nodeInfo.node && !nodeInfo.node[props.props.children]) {
          return false;
        }
      }
      if (!checkedKeysRoot.value.includes(nodeKey)) {
        checkedKeysRoot.value.push(nodeKey);
      }
      return true;
    };
    let removeCheckedKey = function (nodeKey: string | number, isDisabled: boolean) {
      if (isDisabled) {
        console.log('removeCheckedKey，节点为禁用的，', nodeKey);
        let nodeInfo = findNodeInfoByValue2(nodeKey, props.nodeKey, flatTreeNodeInfoArr.value);
        // 如果被禁用的节点没有子节点，则不移除
        if (nodeInfo.node && !nodeInfo.node[props.props.children]) {
          console.log('removeCheckedKey，节点为禁用的且没有子节点', nodeKey);
          return false;
        }
      }
      let index = checkedKeysRoot.value.findIndex(item => item === nodeKey);
      if (index > -1) {
        checkedKeysRoot.value.splice(index, 1);
      }
      return true;
    };
    let addHalfCheckedKey = function (nodeKey: string | number) {
      if (!halfCheckedKeys.value.includes(nodeKey)) {
        halfCheckedKeys.value.push(nodeKey);
      }
    };
    let removeHalfCheckedKey = function (nodeKey: string | number) {
      let index = halfCheckedKeys.value.findIndex(item => item === nodeKey);
      if (index > -1) {
        halfCheckedKeys.value.splice(index, 1);
      }
    };

    // 判断节点是否全部选中
    let nodesIsAllChecked = function (nodes: BsNodeData | BsNodeData[], callback?: (node: BsNodeData, nodeValue: any) => void) {
      let allChecked = true;
      let hasChecked = false;
      let hasHalfChecked = false;
      let nodeKey = props.nodeKey;
      let checkedKeys = checkedKeysRoot.value;
      let halfCheckedKeysVal = halfCheckedKeys.value;
      // console.log('nodesIsAllChecked called');
      if (!Array.isArray(nodes)) {
        nodes = [nodes];
      }
      nodes.forEach((nodeItem: BsNodeData) => {
        let nodeValue = nodeItem[nodeKey];
        if (typeof callback === 'function') {
          callback(nodeItem, nodeValue);
        }
        // console.log('nodesIsAllChecked called 222, ', nodeValue);
        let isChecked = checkedKeys.includes(nodeValue);
        if (halfCheckedKeysVal.includes(nodeValue)) {
          hasHalfChecked = true;
        }
        if (!isChecked || hasHalfChecked) {
          allChecked = false;
        }
        if (isChecked) {
          hasChecked = true;
        }
      });
      return {
        allChecked,
        hasChecked,
        hasHalfChecked
      };
    };

    // 设置最顶层的父级节点半选中状态
    let setTopParentsIndeterminate = function (topParent: BsNodeData, flag = false) {
      if (!topParent) {
        return;
      }
      if (!flag) {
        removeHalfCheckedKey(topParent[props.nodeKey]);
      } else {
        addHalfCheckedKey(topParent[props.nodeKey]);
      }
    };

    // 关联父级选择框
    let linkParentCheckbox = function (addNodeToCheckedKeys = false) {
      if (props.checkStrictly) {
        return;
      }
      console.time('linkParentCheckbox执行耗时：');
      // 已经处理过的节点的key
      let processedKes: StringKeyObject = {};
      let nodeKey = props.nodeKey;
      let childKey = props.props.children;
      let disabledKey = props.props.disabled;
      let checkedKeys = checkedKeysRoot.value;
      let flatTree = flatTreeNodeInfoArr.value;

      checkedKeys.forEach((checkedKey: string | number) => {
        if (checkedKey in processedKes) {
          console.log('linkParentCheckbox checkedKey in ProcessedKeys', checkedKey);
          return;
        }

        // console.log('linkParentCheckbox1111', checkedKey);
        let topParent = findTopParentByNodeValue2(checkedKey, nodeKey, flatTree);
        console.log('topParent', checkedKey, topParent);
        let topParentValue = topParent ? topParent[nodeKey] : '';
        if (topParentValue && (topParentValue in processedKes)) {
          return;
        }
        if (topParent) {
          processedKes[topParentValue] = 1;
        }
        // 根据节点的值（如果有顶层父节点则从顶层父节点开始）查找有children的子节点
        let hasChildrenChildNodes = findChildrenWhichHasChildren2(topParentValue ? topParentValue : checkedKey, nodeKey, childKey, flatTree);
        // console.log('hasChildrenNodes', hasChildrenChildNodes);

        if (hasChildrenChildNodes.length === 0) {
          let currentNodeInfo = findNodeInfoByValue2(checkedKey, nodeKey, flatTree);
          console.log('aaaaa', currentNodeInfo);
          if (!currentNodeInfo.node) {
            console.log('未找到节点，', checkedKey);
            return;
          }
          // 如果节点没有有children的子节点，那么hasChildrenChildNodes就是它自己，此时节点可能为最后一层，或倒数第二层
          hasChildrenChildNodes = [currentNodeInfo.node];
        } else if (!topParent && hasChildrenChildNodes.length > 0) { // 如果节点已经没有了父级节点，并且还有子节点，那么它自己就是顶级节点
          topParent = findNodeInfoByValue2(checkedKey, nodeKey, flatTree).node;
          topParentValue = topParent ? topParent[nodeKey] : '';
          console.log('topParent2222', topParent, topParentValue);
        }

        let isChildrenAllChecked = true; // 子孙节点是否有全部选中
        let hasCheckedChild = false; // 子孙节点是否有选中
        console.log('hasChildrenChildNodes', hasChildrenChildNodes);
        // 将hasChildrenChildNodes反转过来后判断节点的子节点是否全部选中
        [...hasChildrenChildNodes].reverse().forEach((nodeItem: BsNodeData) => {
          let nodeValue = nodeItem[nodeKey];
          console.log('linkParentCheckbox111', nodeItem, nodeValue);
          if (nodeValue in processedKes) {
            console.log('linkParentCheckbox---', nodeValue, '在已处理的节点中');
            return;
          }
          console.log('linkParentCheckbox2222', nodeValue);
          let disabled = nodeItem[disabledKey];
          processedKes[nodeValue] = 1;
          let nodeChildren = nodeItem[childKey];
          if (nodeChildren && nodeChildren.length > 0) {
            console.log('checkedKeys.includes(nodeValue)', checkedKeys.includes(nodeValue), nodeValue);
            // 如果节点有子节点，且节点被选中了，则全选它的子孙节点
            if (checkedKeys.includes(nodeValue)) {
              console.log('linkParentCheckbox全选子孙节点=============', nodeValue);
              // 全选子孙节点
              addChildrenChecked(nodeValue);
              let childCheckedInfo = nodesIsAllChecked(nodeChildren, function (node, nodeValue) {
                processedKes[nodeValue] = 1;
              });
              hasCheckedChild = childCheckedInfo.hasChecked;
              isChildrenAllChecked = childCheckedInfo.allChecked;
            } else {
              let childrenIsAllChecked = nodesIsAllChecked(nodeChildren, function (node, nodeValue) {
                processedKes[nodeValue] = 1;
              });
              console.log('linkParentCheckbox333', nodeValue);
              // console.log('childrenIsAllChecked', childrenIsAllChecked);

              // 如果子孙节点全部选中，则该节点为选中状态
              if (childrenIsAllChecked.allChecked && !childrenIsAllChecked.hasHalfChecked) {
                removeHalfCheckedKey(nodeValue);
                if (addNodeToCheckedKeys) {
                  addCheckedKey(nodeValue, disabled);
                }
                hasCheckedChild = true;
                console.log('removeCheckedKey444', nodeValue);
              } else {
                // 子节点必须有一个选中的或者有半选中状态的才能设置父节点的半选中状态
                if (childrenIsAllChecked.hasChecked || childrenIsAllChecked.hasHalfChecked) {
                  addHalfCheckedKey(nodeValue);
                  if (addNodeToCheckedKeys) {
                    removeCheckedKey(nodeValue, disabled);
                  }
                  console.log('removeCheckedKey555', nodeValue);
                  // hasHalfCheckedChild = true;
                  hasCheckedChild = true;
                } else if (!childrenIsAllChecked.hasChecked && !childrenIsAllChecked.hasHalfChecked) {
                  console.log('removeCheckedKey666', nodeValue);
                  if (addNodeToCheckedKeys) {
                    removeCheckedKey(nodeValue, disabled);
                    removeHalfCheckedKey(nodeValue);
                    console.log('removeCheckedKey666--2', nodeValue);
                  }
                } else {
                  removeCheckedKey(nodeValue, disabled);
                  console.log('removeCheckedKey777', nodeValue);
                }
                isChildrenAllChecked = false;
                console.log('removeCheckedKey888', nodeValue);
              }
            }
          }
        });
        // 顶层父级节点的直接子节点选中信息
        let topParentChildCheckedInfo = {
          allChecked: false,
          hasChecked: false,
          hasHalfChecked: false
        };
        if (topParent) {
          let topParentChildren = topParent[childKey];
          if (topParentChildren && topParentChildren.length > 0) {
            topParentChildCheckedInfo = nodesIsAllChecked(topParentChildren);
          }
        }
        // 子孙节点必须有一个选中的，那么顶层父级节点才能设置为半选中状态
        setTopParentsIndeterminate(topParent, (!isChildrenAllChecked && hasCheckedChild) || !topParentChildCheckedInfo.allChecked);
        // 如果所有子孙节点都选中了，则将顶层父节点也设置为选中状态
        if (isChildrenAllChecked && topParentChildCheckedInfo.allChecked) {
          addCheckedKey(topParentValue, topParent[disabledKey]);
          console.log('99999');
        } else if (!isChildrenAllChecked && !hasCheckedChild && !topParentChildCheckedInfo.hasChecked) { // 如果所有子孙节点都未选中，则需将顶层父节点取消选中
          removeCheckedKey(topParentValue, topParent[disabledKey]);
          console.log('10101010');
        }
      });
      console.log('halfCheckedKeys', halfCheckedKeys.value);
      console.log('processedKeys', processedKes);
      console.timeEnd('linkParentCheckbox执行耗时：');
    };

    // 移除父级节点的选中状态
    let removeParentsChecked = function (nodeValue: string|number) {
      let nodeKey = props.nodeKey;
      let childrenKey = props.props.children;
      let parents = findParentsByNodeValue2(nodeValue, nodeKey, flatTreeNodeInfoArr.value);
      parents.forEach(function (parentNodeInfo) {
        console.log('移除父节点的选中状态');
        let parentNodeValue = parentNodeInfo.node[nodeKey];
        let childrenCheckedInfo = nodesIsAllChecked(parentNodeInfo.node[childrenKey]);
        if (childrenCheckedInfo.allChecked) {
          return;
        }
        if (childrenCheckedInfo.hasChecked || childrenCheckedInfo.hasHalfChecked) {
          removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
          addHalfCheckedKey(parentNodeValue);
        } else {
          removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
          removeHalfCheckedKey(parentNodeValue);
        }
      });
    };

    // 添加父级节点的选中状态
    let addParentsChecked = function (nodeValue: string|number) {
      let nodeKey = props.nodeKey;
      let childrenKey = props.props.children;
      let parents = findParentsByNodeValue2(nodeValue, nodeKey, flatTreeNodeInfoArr.value);
      parents.forEach(function (parentNodeInfo) {
        console.log('添加父节点的选中状态, addParentsChecked');
        let parentNodeValue = parentNodeInfo.node[nodeKey];
        let childrenCheckedInfo = nodesIsAllChecked(parentNodeInfo.node[childrenKey]);

        if (childrenCheckedInfo.allChecked) {
          console.log('添加父节点的选中状态, addParentsChecked 1111', parentNodeValue);
          addCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
          removeHalfCheckedKey(parentNodeValue);
        } else if (childrenCheckedInfo.hasHalfChecked || childrenCheckedInfo.hasChecked) {
          console.log('添加父节点的选中状态, addParentsChecked 2222', parentNodeValue);
          removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
          addHalfCheckedKey(parentNodeValue);
        } else {
          console.log('添加父节点的选中状态, addParentsChecked 333', parentNodeValue);
          removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
          removeHalfCheckedKey(parentNodeValue);
        }
      });
    };

    let removeChildrenChecked = function (nodeValue: string|number) {
      let nodeKey = props.nodeKey;
      let childrenKey = props.props.children;
      let disabledKey = props.props.disabled;
      let nodeInfo = findNodeInfoByValue2(nodeValue, nodeKey, flatTreeNodeInfoArr.value);
      if (!nodeInfo.node) {
        return;
      }
      let children = nodeInfo.node[childrenKey];
      if (children && children.length > 0) {
        // 根据节点的值查找有children的子节点
        let hasChildrenChildNodes = findChildrenWhichHasChildren2(nodeValue, nodeKey, childrenKey, flatTreeNodeInfoArr.value);
        hasChildrenChildNodes.unshift(nodeInfo.node);
        // 将有子节点的节点反转过来后再进行处理，这样就达到了从下往上处理的效果
        hasChildrenChildNodes.reverse().forEach((nodeDataItem: BsNodeData) => {
          console.log('----------nodeDataItem', nodeDataItem);
          let children = nodeDataItem[childrenKey];
          let nodeDataItemValue = nodeDataItem[nodeKey];
          nodeDataItem[childrenKey].forEach((childNodeData: BsNodeData) => {
            removeCheckedKey(childNodeData[nodeKey], childNodeData[disabledKey]);
          });
          let childrenCheckedInfo = nodesIsAllChecked(children);
          if (childrenCheckedInfo.allChecked) {
            console.log('removeChildrenChecked allChecked');
            addCheckedKey(nodeDataItemValue, nodeDataItem[disabledKey]);
            removeHalfCheckedKey(nodeDataItemValue);
            return;
          }
          if (!childrenCheckedInfo.hasChecked && !childrenCheckedInfo.hasHalfChecked) {
            removeCheckedKey(nodeDataItemValue, nodeDataItem[disabledKey]);
            removeHalfCheckedKey(nodeDataItemValue);
          } else {
            removeCheckedKey(nodeDataItemValue, nodeDataItem[disabledKey]);
            addHalfCheckedKey(nodeDataItemValue);
          }
        });
      }
    };

    // 全选子孙节点
    let addChildrenChecked = function (nodeValue: string|number) {
      console.log('addChildrenChecked 全选子孙节点', nodeValue);
      let nodeKey = props.nodeKey;
      let childrenKey = props.props.children;
      let disabledKey = props.props.disabled;

      let nodeInfo = findNodeInfoByValue2(nodeValue, nodeKey, flatTreeNodeInfoArr.value);
      if (!nodeInfo.node) {
        return;
      }
      // let children = nodeInfo.node[childrenKey];
      // 根据节点的值查找有children的子节点
      let hasChildrenChildNodes = findChildrenWhichHasChildren2(nodeValue, nodeKey, childrenKey, flatTreeNodeInfoArr.value);
      hasChildrenChildNodes.unshift(nodeInfo.node);
      console.log('addChildrenChecked hasChildrenChildNodes[]', hasChildrenChildNodes);
      // 将有子节点的节点反转过来后再进行处理，这样就达到了从下往上处理的效果
      hasChildrenChildNodes.reverse().forEach((nodeDataItem: BsNodeData) => {
        console.log('----------nodeDataItem222', nodeDataItem);
        let children = nodeDataItem[childrenKey];
        let nodeDataItemValue = nodeDataItem[nodeKey];
        nodeDataItem[childrenKey].forEach((childNodeData: BsNodeData) => {
          addCheckedKey(childNodeData[nodeKey], childNodeData[disabledKey]);
        });
        let childrenCheckedInfo = nodesIsAllChecked(children);
        if (childrenCheckedInfo.allChecked) {
          console.log('addChildrenChecked 111', childrenCheckedInfo.hasHalfChecked);
          addCheckedKey(nodeDataItemValue, nodeDataItem[disabledKey]);
          removeHalfCheckedKey(nodeDataItemValue);
          return;
        }
        if (childrenCheckedInfo.hasChecked || childrenCheckedInfo.hasHalfChecked) {
          removeCheckedKey(nodeDataItemValue, nodeDataItem[disabledKey]);
          addHalfCheckedKey(nodeDataItemValue);
          console.log('addChildrenChecked 222');
        } else {
          console.log('addChildrenChecked 333');
          removeCheckedKey(nodeDataItemValue, nodeDataItem[disabledKey]);
          removeHalfCheckedKey(nodeDataItemValue);
        }
      });
    };

    let isInited = false;
    watch([() => props.treeData, () => props.props], function ([treeData, nodeProps]) {
      console.time('监听treeData变化，执行耗时');
      // flatTreeNodeInfoArr.value = flatTreeDataToObject(treeData, nodeProps.children, 1, '', {});
      flatTreeNodeInfoArr.value = treeDataToFlattarnArr2(treeData, nodeProps.children, nodeProps.disabled, 1, '', []);
      console.log('flatTreeNodeInfoArr', flatTreeNodeInfoArr.value);
      if (isInited) { // 还未进行初始化的时候不执行linkParentCheckbox函数，因为下面的watch props.checkedKeys会执行
        linkParentCheckbox(true);
      }
      isInited = true;
      console.timeEnd('监听treeData变化，执行耗时');
    }, {
      immediate: true,
      deep: true
    });

    watch(() => [...props.checkedKeys], function (checkedKeys) {
      console.log('watch props.checkedKeys111', checkedKeys);
      if (checkedKeysRoot.value !== checkedKeys) {
        if (!props.showCheckbox && props.showRadio) { // 单选
          if (checkedKeys?.length >= 1) {
            checkedKeysRoot.value = checkedKeys.slice(0, 1);
          }
          return;
        }
        let checkedKeysSorted = checkedKeys.slice(0).sort();
        let checkedKeysRootSorted = checkedKeysRoot.value.slice(0).sort();
        // 当用户手动改变了复选框的值，那么 checkedKeys 会等于 checkedKeysRoot.value
        if (checkedKeysSorted.join(',') === checkedKeysRootSorted.join(',')) {
          console.log('watch props.checkedKeys222。 两者值一样，不进行后续处理');
          return;
        }
        console.log('watch props.checkedKeys333');
        checkedKeysRoot.value = checkedKeys;
        if (checkedKeys.length == 0) {
          halfCheckedKeys.value = [];
          return;
        }
        linkParentCheckbox(true);
      }
    }, { immediate: true });

    watch(() => props.expandedKeys, function (expandedKeys: (string | number)[]) {
      let timer2 = new Date().getTime();
      if (expandedKeys?.length > 0 && expandedKeysRoot.value !== expandedKeys) {
        let parentKeys: (string | number)[] = [];
        if (props.autoExpandParent) { // 自动展开父节点
          let flatTreeMapData = flatTreeNodeInfoArr.value;
          let nodeKey = props.nodeKey;

          expandedKeys.forEach((expandedKey: string | number) => {
            /* let nodeInfo = findNodeByValue(expandedKey, nodeKey, flatTreeMapData);
            let nodeParents = nodeInfo.nodeLevelPath ? findNodeParentsByNodeLevelPath(nodeInfo.nodeLevelPath, flatTreeMapData) : []; */
            let nodeInfo = findNodeInfoByValue2(expandedKey, nodeKey, flatTreeMapData);
            let nodeParents = nodeInfo.nodeLevelPath ? findParentsByNodeLevelPath2(nodeInfo.nodeLevelPath, flatTreeMapData) : [];
            nodeParents.forEach((nodeItem: any) => {
              parentKeys.push(nodeItem.node[nodeKey]);
            });
          });
        }
        expandedKeysRoot.value = Array.from(new Set([...expandedKeys, ...parentKeys, ...expandedKeysRoot.value]));
      }
      console.log('自动展开节点计算耗时：', new Date().getTime() - timer2);
    }, { immediate: true });

    // 当前选中的节点
    let currentNode = ref<unknown | null>(null);

    // 分页相关数据
    let { pageCount, nodeChildren, totalPage, showMoreChildNode, showAllChildNode } = useTreePagination(props, flatTreeNodeInfoArr, toRef(props, 'treeData'));

    // 根据节点值查找节点
    let getNodeByNodeValue = function (nodeValue: string|number) {
      let flatTreeInfo = flatTreeNodeInfoArr.value;
      let nodeInfo = findNodeInfoByValue2(nodeValue, props.nodeKey, flatTreeInfo);
      if (!nodeInfo.node) {
        return null;
      }
      return nodeInfo.node;
    };

    // 根据节点值查找父级节点
    let getNodeByNodeLevelPath = function (nodeLevelPath: string) {
      let nodeInfo = flatTreeNodeInfoArr.value.find(nodeInfoItem => nodeInfoItem.nodeLevelPath === nodeLevelPath);
      if (nodeInfo) {
        return nodeInfo.node;
      }
      return null;
    };

    // 根据节点值查找父级节点
    let getParentNodeByNodeValue = function (nodeValue: string|number) {
      let flatTreeInfo = flatTreeNodeInfoArr.value;
      let nodeInfo = findNodeInfoByValue2(nodeValue, props.nodeKey, flatTreeInfo);
      if (!nodeInfo.node) {
        return null;
      }
      let nodeLevelPath = nodeInfo.nodeLevelPath;
      return getParentNodeByNodeLevelPath(nodeLevelPath);
    };

    // 根据节点值查找父级节点
    let getParentNodeByNodeLevelPath = function (nodeLevelPath: string) {
      // 获取最后一个"_"下划线的位置
      let lastUnderlineIndex = nodeLevelPath.lastIndexOf('_');
      if (lastUnderlineIndex == -1) {
        return null;
      }
      nodeLevelPath = nodeLevelPath.substring(0, lastUnderlineIndex);
      let parentNodeInfo = flatTreeNodeInfoArr.value.find(nodeInfoItem => nodeInfoItem.nodeLevelPath === nodeLevelPath);
      if (parentNodeInfo) {
        return parentNodeInfo.node;
      }
      return null;
    };

    // 向子孙组件提供根tree上下文
    provide<TreeContext>(bsTreeContextKey, {
      ctx,
      // flatTreeMap,
      flatTreeNodeInfoArr,
      halfCheckedKeys,
      currentNode,
      addCheckedKey (nodeValue: string | number, nodeData: BsNodeData, hasChildren: boolean) {
        if (!checkedKeysRoot.value.includes(nodeValue)) {
          if (props.showCheckbox) {
            let disabledKey = props.props.disabled;
            // let nodeKey = props.nodeKey;
            // let childrenKey = props.props.children;

            // 如果节点有子孙节点，则全选它的子孙节点
            if (!props.checkStrictly) {
              if (hasChildren) {
                addChildrenChecked(nodeValue);
              } else {
                addCheckedKey(nodeValue, nodeData[disabledKey]);
              }
              // 添加父级节点的选中状态
              addParentsChecked(nodeValue);
            } else {
              addCheckedKey(nodeValue, nodeData[disabledKey]);
            }
            // linkParentCheckbox(true);
          } else if (props.showRadio) {
            checkedKeysRoot.value = [nodeValue];
          }
          ctx.emit('check-change', nodeData, true);
          ctx.emit('update:checkedKeys', [...checkedKeysRoot.value]);
        }
      },
      removeCheckedKey (nodeValue: string | number, nodeData: BsNodeData, hasChildren: boolean) {
        // let index = checkedKeysRoot.value.findIndex((item) => item === nodeValue);
        // if (index > -1) {
        // let nodeKey = props.nodeKey;
        let childrenKey = props.props.children;
        let disabledKey = props.props.disabled;
        // removeCheckedKey(nodeValue, nodeData[disabledKey]);
        console.log('手动 removeCheckedKey 111');
        if (props.showCheckbox) {
          // 如果节点有子孙节点，则取消全选它的子孙节点
          if (!props.checkStrictly) {
            console.log('removeCheckedKey 取消全选子孙节点', nodeValue, nodeData, childrenKey);
            if (hasChildren && nodeData[childrenKey].length > 0) {
              // 移除子孙节点的选中状态
              removeChildrenChecked(nodeValue);
              // 移除父级节点的选中状态
              removeParentsChecked(nodeValue);
            } else {
              console.log('removeCheckedKey 444', nodeValue);
              removeCheckedKey(nodeValue, nodeData[disabledKey]);
              // 移除父级节点的选中状态
              removeParentsChecked(nodeValue);
            }
          } else {
            removeCheckedKey(nodeValue, nodeData[disabledKey]);
          }
          // linkParentCheckbox(true, nodeValue);
          // console.log('removeCheckedKey 取消全选子孙节点----------checkedKeysRoot', checkedKeysRoot);
        } else {
          removeCheckedKey(nodeValue, nodeData[disabledKey]);
        }
        ctx.emit('check-change', nodeData, false);
        ctx.emit('update:checkedKeys', [...checkedKeysRoot.value]);
        // }
      },
      // 节点展开/收起事件
      onNodeExpand (flag: boolean, nodeData: BsNodeData, nodeState: any) {
        // console.log('子节点展开事件执行了', nodeData, flag);
        ctx.emit('node-expand', nodeData, flag, nodeState);
      },
      // 节点点击事件
      onNodeClick (nodeData: BsNodeData, nodeState: any) {
        ctx.emit('node-click', nodeData, nodeState);
      },
      // 节点销毁事件
      onNodeDestroy (nodeData: BsNodeData) {
        ctx.emit('node-destroy', nodeData);
      }
    });
    // 计算radio的name属性名称
    let radioNameRoot = computed(function () {
      let radioName = props.radioName;
      if (radioName && radioName != '--') {
        return radioName;
      }
      return treeId + '_radio';
    });

    console.timeEnd('Tree组件Script执行耗时：');
    return {
      expandedKeysRoot,
      checkedKeysRoot,
      checkedKeysDisabledWhichIsParent,
      halfCheckedKeys,
      pageCount,
      nodeChildren,
      totalPage,
      treeId,
      radioNameRoot,

      showMoreChildNode,
      showAllChildNode,
      getParentNodeByNodeLevelPath,
      getParentNodeByNodeValue,
      getNodeByNodeValue,
      getNodeByNodeLevelPath
    };
  }
});
</script>

<style lang="scss">
.bs-tree {
  background-color: #fff;
}

.bs-tree-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #999;
}
</style>
