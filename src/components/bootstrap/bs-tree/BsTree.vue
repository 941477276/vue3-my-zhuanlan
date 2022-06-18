<template>
  <div class="bs-tree" role="tree">
    <BsTreeNode
      v-for="(nodeItem, index) in treeData"
      v-bind="$props"
      :node-data="nodeItem"
      :key="nodeItem[nodeKey]"
      :node-leave="1"
      :label-key="props.label"
      :disabled-key="props.disabled"
      :children-key="props.children"
      :is-leaf-key="props.isLeaf"
      :node-leave-path="`${index + 1}`"></BsTreeNode>
    <div class="bs-tree-empty" v-if="false">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  provide
} from 'vue';
import BsTreeNode from './widgets/BsTreeNode.vue';
import { bsTreeProps } from './bs-tree-props';
import { bsTreeContextKey, TreeContext } from '@/ts-tokens/bootstrap/tree';

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
  setup (props: any, ctx: any) {
    // 向子孙组件提供根tree上下文
    provide<TreeContext>(bsTreeContextKey, {
      ctx
    });

    return {};
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
