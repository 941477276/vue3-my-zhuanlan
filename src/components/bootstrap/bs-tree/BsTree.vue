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
import {
  Ref,
  defineComponent,
  provide,
  ref,
  reactive,
  watch,
  shallowRef
} from 'vue';
import BsTreeNode from './widgets/BsTreeNode.vue';
import { bsTreeProps } from './bs-tree-props';
import { bsTreeContextKey, TreeContext } from '@/ts-tokens/bootstrap/tree';
import { StringKeyObject } from '@/ts-tokens/bootstrap';
import {
  flatTreeDataToObject2,
  findParentsByNodeLevelPath2,
  findNodeByValue2,
  findChildrenWhichHasChildren2
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
    let flatTreeMap = ref([]);
    watch([() => props.treeData, () => props.props], function ([treeData, nodeProps]) {
      let startTimer = new Date().getTime();
      // flatTreeMap.value = flatTreeDataToObject(treeData, nodeProps.children, 1, '', {});
      flatTreeMap.value = flatTreeDataToObject2(treeData, nodeProps.children, 1, '', []);
      console.log('扁平化树形对象耗时：', new Date().getTime() - startTimer);
      console.log('flatTreeMap', flatTreeMap.value);
    }, { immediate: true, deep: true });

    // 展开的节点的key数组
    let expandedKeysRoot = ref(props.expandedKeys);
    let addExpandedKey = function (nodeKey: string|number) {
      if (!expandedKeysRoot.value.includes(nodeKey)) {
        expandedKeysRoot.value.push(nodeKey);
      }
    };
    let removeExpandedKey = function (nodeKey: string|number) {
      let index = expandedKeysRoot.value.findIndex((item: any) => item === nodeKey);
      if (index > -1) {
        expandedKeysRoot.value.splice(index, 1);
      }
    };
    watch(() => props.expandedKeys, function (expandedKeys: (string|number)[]) {
      let timer2 = new Date().getTime();
      if (expandedKeys?.length > 0 && expandedKeysRoot.value !== expandedKeys) {
        let parentKeys: (string|number)[] = [];
        if (props.autoExpandParent) { // 自动展开父节点
          let flatTreeMapData = flatTreeMap.value;
          let nodeKey = props.nodeKey;

          expandedKeys.forEach((expandedKey: string|number) => {
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
    let checkedKeysRoot = ref<(string|number)[]>([]);
    // 半选中状态节点的key数组
    let halfCheckedKeys = ref<(string|number)[]>([]);
    let addCheckedKey = function (nodeKey: string|number, nodeData: any) {
      if (!checkedKeysRoot.value.includes(nodeKey)) {
        checkedKeysRoot.value.push(nodeKey);
        ctx.emit('check-change', nodeData, true);
        ctx.emit('update:checkedKeys', checkedKeysRoot.value);
      }
    };
    let removeCheckedKey = function (nodeKey: string|number, nodeData: any) {
      let index = checkedKeysRoot.value.findIndex((item: any) => item === nodeKey);
      if (index > -1) {
        checkedKeysRoot.value.splice(index, 1);
        ctx.emit('check-change', nodeData, false);
        ctx.emit('update:checkedKeys', checkedKeysRoot.value);
      }
    };
    let addHalfCheckedKey = function (nodeKey: string|number) {
      if (!halfCheckedKeys.value.includes(nodeKey)) {
        halfCheckedKeys.value.push(nodeKey);
      }
    };
    let removeHalfCheckedKey = function (nodeKey: string|number) {
      let index = halfCheckedKeys.value.findIndex((item: any) => item === nodeKey);
      if (index > -1) {
        halfCheckedKeys.value.splice(index, 1);
      }
    };
    // 关联父级选择框
    let linkParentCheckbox = function () {
      if (props.checkStrictly) {
        return;
      }
      // 选择的节点的父级节点的key对象
      let checkedParentKeys: StringKeyObject = {};
      // 已经处理过的节点的key
      let processedKes: StringKeyObject = {};
      let nodeKey = props.nodeKey;
      let checkedKeys = checkedKeysRoot.value;

      // 判断节点是否全部选中
      let nodeIsAllChecked = function (nodes: any[]) {
        let flag = true;
        console.log('nodeIsAllChecked called');
        nodes.forEach((childItem: any) => {
          let nodeValue = childItem[nodeKey];
          processedKes[nodeValue] = 1;
          console.log('nodeIsAllChecked called 222, ', nodeValue);
          let isChecked = checkedKeys.includes(nodeValue);
          if (!isChecked) {
            flag = false;
          }
        });
        return false;
      };

      checkedKeys.forEach((checkedKey: string|number) => {
        if (checkedKey in processedKes) {
          return;
        }
        console.log('linkParentCheckbox1111', checkedKey);
        // 根据节点的值查找有children的子节点
        let hasChildrenChildNodes = findChildrenWhichHasChildren2(checkedKey, nodeKey, flatTreeMap.value);
        console.log('hasChildrenNodes', hasChildrenChildNodes);
        processedKes[checkedKey] = 1;
        if (hasChildrenChildNodes.length === 0) {
          return;
        }
        // 将hasChildrenChildNodes反转过来后判断节点的子节点是否全部选中
        [...hasChildrenChildNodes].reverse().forEach((nodeItem: any) => {
          let nodeValue = nodeItem[nodeKey];
          if (nodeValue in processedKes) {
            return;
          }
          console.log('linkParentCheckbox2222', nodeValue);
          processedKes[nodeValue] = 1;
          let nodeChildren = nodeItem.children;
          if (nodeChildren && nodeChildren.length > 0) {
            let childrenIsAllChecked = nodeIsAllChecked(nodeChildren);
            // 如果子节点未全部选中，则该节点为半选中状态
            if (childrenIsAllChecked) {
              removeHalfCheckedKey(nodeValue);
            } else {
              addHalfCheckedKey(nodeValue);
            }
          }
        });
      });
    };
    // 设置节点半选中状态
    let setHalfCheckedKeys = function () {
      if (props.checkStrictly) {
        return;
      }
      // 已经处理过的父级节点的key
      let processedParentKes = {};
      [...checkedKeysRoot.value].reverse().forEach(checkedKey => {
      //
      });
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
    let currentNode = ref<unknown|null>(null);

    // 向子孙组件提供根tree上下文
    provide<TreeContext>(bsTreeContextKey, {
      ctx,
      flatTreeMap,
      currentNode,
      addCheckedKey,
      removeCheckedKey,
      onNodeExpand (flag: boolean, nodeData: any, nodeState: any) {
        // console.log('子节点展开事件执行了', nodeData, flag);
        ctx.emit('node-expand', nodeData, flag, nodeState);
      },
      onNodeClick (nodeData: any, nodeState: any) {
        ctx.emit('node-click', nodeData, nodeState);
      }
    });

    console.log('Tree组件Script执行耗时：', new Date().getTime() - timeStart);
    return {
      expandedKeysRoot,
      checkedKeysRoot
    };
  }
});
</script>

<style lang="scss">
.bs-tree{
  background-color: #fff;
}
.bs-tree-empty{
  padding: 2rem 1rem;
  text-align: center;
  color: #999;
}
</style>
