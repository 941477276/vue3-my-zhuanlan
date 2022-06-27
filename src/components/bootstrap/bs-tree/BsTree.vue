<template>
  <div
    class="bs-tree"
    :class="{
      'bs-tree-highlight-current': highlightCurrent
    }"
    role="tree">
    <BsTreeNode
      v-for="(nodeItem, index) in treeData"
      v-bind="$props"
      :node-data="nodeItem"
      :key="nodeItem[nodeKey]"
      :node-leave="1"
      :node-leave-path="`${index + 1}`"
      :label-key="props.label"
      :disabled-key="props.disabled"
      :children-key="props.children"
      :is-leaf-key="props.isLeaf"
      :expanded-keys="expandedKeysRoot"
      :checked-keys="checkedKeysRoot"></BsTreeNode>
    <div class="bs-tree-empty" v-if="false">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, watch } from 'vue';
import BsTreeNode from './widgets/BsTreeNode.vue';
import { bsTreeProps } from './bs-tree-props';
import { BsNodeData, BsNodeInfo, bsTreeContextKey, TreeContext } from '@/ts-tokens/bootstrap/tree';
import { StringKeyObject } from '@/ts-tokens/bootstrap';
import {
  findChildrenWhichHasChildren2,
  findNodeByValue2,
  findParentsByNodeLevelPath2,
  findTopParentByNodeValue2,
  flatTreeDataToObject2
} from './bs-tree-utils';

export default defineComponent({
  name: 'BsTree',
  components: {
    BsTreeNode
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
  emits: ['node-expand', 'check-change', 'node-click', 'update:checkedKeys'],
  setup (props: any, ctx: any) {
    let timeStart = new Date().getTime();
    // 扁平的树对象
    // let flatTreeMap = ref<BsNodeInfo[]>([]);
    // 扁平化的树信息
    let flatTreeNodeInfoArr = ref<BsNodeInfo[]>([]);
    watch([() => props.treeData, () => props.props], function ([treeData, nodeProps]) {
      let startTimer = new Date().getTime();
      // flatTreeNodeInfoArr.value = flatTreeDataToObject(treeData, nodeProps.children, 1, '', {});
      flatTreeNodeInfoArr.value = flatTreeDataToObject2(treeData, nodeProps.children, 1, '', []);
      console.log('扁平化树形对象耗时：', new Date().getTime() - startTimer);
      console.log('flatTreeNodeInfoArr', flatTreeNodeInfoArr.value);
    }, {
      immediate: true,
      deep: true
    });

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
            let nodeInfo = findNodeByValue2(expandedKey, nodeKey, flatTreeMapData);
            let nodeParents = nodeInfo.nodeLevelPath ? findParentsByNodeLevelPath2(nodeInfo.nodeLevelPath, flatTreeMapData) : [];
            nodeParents.forEach((nodeItem: any) => {
              parentKeys.push(nodeItem[nodeKey]);
            });
          });
        }
        expandedKeysRoot.value = Array.from(new Set([...expandedKeys, ...parentKeys, ...expandedKeysRoot.value]));
      }
      console.log('自动展开节点计算耗时：', new Date().getTime() - timer2);
    }, { immediate: true });

    // 选中节点的key数组
    // let checkedKeysRoot = ref([...props.checkedKeys]);
    let checkedKeysRoot = ref<(string | number)[]>([]);
    // 半选中状态节点的key数组
    let halfCheckedKeys = ref<(string | number)[]>([]);
    let addCheckedKey = function (nodeKey: string | number) {
      if (!checkedKeysRoot.value.includes(nodeKey)) {
        checkedKeysRoot.value.push(nodeKey);
      }
    };
    let removeCheckedKey = function (nodeKey: string | number) {
      let index = checkedKeysRoot.value.findIndex(item => item === nodeKey);
      if (index > -1) {
        checkedKeysRoot.value.splice(index, 1);
      }
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
      console.log('nodesIsAllChecked called');
      if (!Array.isArray(nodes)) {
        nodes = [nodes];
      }
      nodes.forEach((nodeItem: BsNodeData) => {
        let nodeValue = nodeItem[nodeKey];
        if (typeof callback === 'function') {
          callback(nodeItem, nodeValue);
        }
        console.log('nodesIsAllChecked called 222, ', nodeValue);
        let isChecked = checkedKeys.includes(nodeValue);
        if (halfCheckedKeysVal.includes(nodeValue)) {
          hasHalfChecked = true;
        }
        if (!isChecked) {
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
    let linkParentCheckbox = function () {
      if (props.checkStrictly) {
        return;
      }
      // 已经处理过的节点的key
      let processedKes: StringKeyObject = {};
      let nodeKey = props.nodeKey;
      let checkedKeys = checkedKeysRoot.value;
      let flatTree = flatTreeNodeInfoArr.value;

      checkedKeys.forEach((checkedKey: string | number) => {
        if (checkedKey in processedKes) {
          console.log('linkParentCheckbox checkedKey in ProcessedKeys', checkedKey);
          return;
        }
        console.log('linkParentCheckbox1111', checkedKey);
        let topParent = findTopParentByNodeValue2(checkedKey, nodeKey, flatTree);
        console.log('topParent', topParent);
        let topParentValue = topParent ? topParent[nodeKey] : '';
        if (topParentValue && (topParentValue in processedKes)) {
          return;
        }
        if (topParent) {
          processedKes[topParentValue] = 1;
        }
        // 根据节点的值查找有children的子节点
        let hasChildrenChildNodes = findChildrenWhichHasChildren2(topParentValue ? topParentValue : checkedKey, nodeKey, flatTree);
        console.log('hasChildrenNodes', hasChildrenChildNodes);

        if (hasChildrenChildNodes.length === 0) {
          let currentNode = findNodeByValue2(checkedKey, nodeKey, flatTree);
          if (!currentNode.node) {
            return;
          }
          let currentChildren = currentNode.node.children;
          // 判断当前节点的直接子节点是否全部选中，因为在上一步已经查找过了当前节点的孙级节点，但未找到孙级节点
          if (currentChildren && currentChildren.length > 0) {
            let childrenIsAllChecked = nodesIsAllChecked(currentChildren, function (node, nodeValue) {
              processedKes[nodeValue] = 1;
            });
            console.log('childrenIsAllChecked111', childrenIsAllChecked);
            // 如果子节点未全部选中，则该节点为半选中状态
            if (childrenIsAllChecked.allChecked && !childrenIsAllChecked.hasHalfChecked) {
              // checkedKeysRoot.value
              console.log('111');
              removeHalfCheckedKey(checkedKey);
              addCheckedKey(checkedKey);
              setTopParentsIndeterminate(topParent, false);
            } else {
              if (childrenIsAllChecked.hasChecked) { // 子节点必须有一个选中了的才能设置父节点的半选中状态
                addHalfCheckedKey(checkedKey);
                removeCheckedKey(checkedKey);
                setTopParentsIndeterminate(topParent, true);
                console.log('222');
              } else {
                console.log('removeCheckedKey333');
                removeCheckedKey(checkedKey);
                setTopParentsIndeterminate(topParent, false);
              }
            }
          }
          return;
        }
        // let hasHalfCheckedChild = false; // 标记子孙节点是否有半选中状态
        let isChildrenAllChecked = true; // 子孙节点是否有全部选中
        let hasCheckedChild = false; // 子孙节点是否有选中
        // 将hasChildrenChildNodes反转过来后判断节点的子节点是否全部选中
        [...hasChildrenChildNodes].reverse().forEach((nodeItem: BsNodeData) => {
          let nodeValue = nodeItem[nodeKey];
          if (nodeValue in processedKes) {
            return;
          }
          // console.log('linkParentCheckbox2222', nodeValue);
          processedKes[nodeValue] = 1;
          let nodeChildren = nodeItem.children;
          if (nodeChildren && nodeChildren.length > 0) {
            let childrenIsAllChecked = nodesIsAllChecked(nodeChildren, function (node, nodeValue) {
              processedKes[nodeValue] = 1;
            });
            console.log('childrenIsAllChecked', childrenIsAllChecked);

            // 如果子节点未全部选中，则该节点为半选中状态
            if (childrenIsAllChecked.allChecked && !childrenIsAllChecked.hasHalfChecked) {
              // checkedKeysRoot.value
              removeHalfCheckedKey(nodeValue);
              addCheckedKey(nodeValue);
              hasCheckedChild = true;
              console.log('444');
            } else {
              // 子节点必须有一个选中的或者有半选中状态的才能设置父节点的半选中状态
              if (childrenIsAllChecked.hasChecked || childrenIsAllChecked.hasHalfChecked) {
                addHalfCheckedKey(nodeValue);
                removeCheckedKey(nodeValue);
                setTopParentsIndeterminate(topParent, true);
                console.log('555');
                // hasHalfCheckedChild = true;
                hasCheckedChild = true;
              } else {
                removeCheckedKey(nodeValue);
                console.log('removeCheckedKey666');
              }
              isChildrenAllChecked = false;
              console.log('777');
            }
          }
        });
        // 子孙节点必须有一个选中的，那么顶层父级节点才能设置为半选中状态
        setTopParentsIndeterminate(topParent, !isChildrenAllChecked && hasCheckedChild);
      });
      console.log('halfCheckedKeys', halfCheckedKeys.value);
      console.log('processedKeys', processedKes);
    };

    watch(() => props.checkedKeys, function (checkedKeys) {
      console.log('watch props.checkedKeys111');
      if (checkedKeysRoot.value !== checkedKeys) {
        if (!props.showCheckbox && props.showRadio) { // 单选
          if (checkedKeys?.length > 1) {
            checkedKeysRoot.value = checkedKeys[0];
          } else {
            checkedKeysRoot.value = checkedKeys;
          }
          return;
        }
        /* if (checkedKeys?.length > 0) {
          checkedKeysRoot.value = checkedKeys;
        }
        checkedKeysRoot.value = Array.from(new Set(checkedKeys)); */
        console.log('watch props.checkedKeys222');
        checkedKeysRoot.value = checkedKeys;
        linkParentCheckbox();
      }
    }, { immediate: true });

    // 当前选中的节点
    let currentNode = ref<unknown | null>(null);

    // 向子孙组件提供根tree上下文
    provide<TreeContext>(bsTreeContextKey, {
      ctx,
      // flatTreeMap,
      flatTreeNodeInfoArr,
      halfCheckedKeys,
      currentNode,
      addCheckedKey (nodeValue: string | number, nodeData: BsNodeData) {
        if (!checkedKeysRoot.value.includes(nodeValue)) {
          checkedKeysRoot.value.push(nodeValue);
          ctx.emit('check-change', nodeData, true);
          ctx.emit('update:checkedKeys', checkedKeysRoot.value);
        }
      },
      removeCheckedKey (nodeValue: string | number, nodeData: BsNodeData) {
        let index = checkedKeysRoot.value.findIndex((item) => item === nodeValue);
        if (index > -1) {
          checkedKeysRoot.value.splice(index, 1);
          ctx.emit('check-change', nodeData, false);
          ctx.emit('update:checkedKeys', checkedKeysRoot.value);
        }
      },
      onNodeExpand (flag: boolean, nodeData: BsNodeData, nodeState: any) {
        // console.log('子节点展开事件执行了', nodeData, flag);
        ctx.emit('node-expand', nodeData, flag, nodeState);
      },
      onNodeClick (nodeData: BsNodeData, nodeState: any) {
        ctx.emit('node-click', nodeData, nodeState);
      }
    });

    console.log('Tree组件Script执行耗时：', new Date().getTime() - timeStart);
    return {
      expandedKeysRoot,
      checkedKeysRoot,
      halfCheckedKeys
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
