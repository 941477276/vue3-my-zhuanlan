<template>
  <div class="bs-tree" role="tree">
    <BsTreeNode>福田区</BsTreeNode>
    <BsTreeNode>龙岗区</BsTreeNode>
    <BsTreeNode>南山区</BsTreeNode>
    <BsTreeNode>宝安区</BsTreeNode>
    <BsTreeNode>罗湖区</BsTreeNode>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsTreeNode from './widgets/BsTreeNode.vue';

export default defineComponent({
  name: 'BsTree',
  components: {
    BsTreeNode
  }
});
</script>

<style lang="scss">
.bs-tree{
  background-color: #fff;
}
</style>
