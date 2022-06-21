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
import {
  flatTreeDataToObject2,
  findNodeParentsByNodeLevelPath2,
  findNodeByValue2
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
            let nodeParents = nodeInfo.nodeLevelPath ? findNodeParentsByNodeLevelPath2(nodeInfo.nodeLevelPath, flatTreeMapData) : [];
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
    let checkedKeysRoot = ref([...props.checkedKeys]);
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
      }
    });

    // 当前选中的节点
    let currentNode = ref<unknown|null>(null);

    console.log('flatTreeMap', flatTreeMap.value);

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
