<template>
  <div class="component-usage">
    <h3 style="margin-top: 200px;">单选</h3>
    <bs-tree-select
      v-model="checkedKeys1"
      :tree-data="treeData1"
      :check-strictly="true"
      :radio-visible="true"
      node-key="id"
      style="margin-bottom: 500px;"
      clearable></bs-tree-select>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsTreeSelectUsage',
  components: {},

  setup (props: any) {
    let treeData1 = ref([
      {
        label: '一级 1',
        id: '1',
        children: [
          {
            label: '二级 1-1',
            id: '1_1',
            // disabled: true,
            children: [
              {
                label: '三级 1-1-1',
                id: '1_1_1'
                // disabled: true
              },
              {
                label: '三级 1-1-2',
                id: '1_1_2'
              }
            ]
          },
          {
            label: '二级(叶子节点) 1-2',
            id: '1_2',
            isLeaf: true
          },
          {
            label: '二级 1-3',
            id: '1_3',
            // disabled: true,
            children: [
              {
                label: '三级 1-3-1',
                id: '1_3_1'
              },
              {
                label: '三级 1-3-2',
                id: '1_3_2'
              }
            ]
          },
          {
            label: '二级 1-4',
            id: '1_4'
          }
        ]
      },
      {
        label: '一级 1-5',
        id: '1_5',
        children: [
          {
            label: '一级 1-5-1',
            id: '1_5_1'
            // disabled: true
          },
          {
            label: '一级 1-5-2',
            id: '1_5_2'
            // disabled: true
          },
          {
            label: '一级 1-5-3',
            id: '1_5_3'
            // disabled: true
          }
        ]
      },
      {
        label: '一级 1-6',
        id: '1_6',
        // disabled: true,
        children: [
          {
            label: '一级 1-6-1',
            id: '1_6_1'
          },
          {
            label: '一级 1-6-2',
            id: '1_6_2'
          },
          {
            label: '一级 1-6-3',
            id: '1_6_3'
          }
        ]
      }
    ]);
    let checkedKeys1 = ref(['1_1', '1_2', '1_3_1', '1_3_2', '1_5_1', '1_6', '1_5_2', '1_5_3']);

    return {
      treeData1,
      checkedKeys1
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-tree-select {
  width: auto;
}
</style>
