<template>
  <div class="component-usage">
    <div class="container">
      <div>
        <h3>基本使用</h3>
        <bs-tree :tree-data="treeData1" node-key="id" :defaultExpandedKeys="['2_1', '3']">
          <template #default="{data}">
            <strong>
              {{ data.label }}
            </strong>
          </template>
          <!--<template #switcher-icon>
            >
          </template>-->
        </bs-tree>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsTreeUsage',
  setup () {
    let treeData1 = ref([{
      label: '一级 1',
      id: '1',
      children: [{
        label: '二级 1-1',
        id: '1_1',
        children: [{
          label: '三级 1-1-1',
          id: '1_1_1'
        }]
      }]
    }, {
      label: '一级 2',
      id: '2',
      children: [{
        label: '二级 2-1',
        id: '2_1',
        children: [{
          label: '三级 2-1-1',
          id: '2_2_2'
        }]
      }, {
        label: '二级 2-2',
        id: '2_2',
        children: [{
          label: '三级 2-2-1',
          id: '2_2_1'
        }]
      },
      {
        label: '二级 2-4',
        id: '2_4'
      },
      {
        label: '二级 2-5',
        id: '2_5'
      },
      {
        label: '二级 2-6',
        id: '2_6'
      },
      {
        label: '二级 2-7',
        id: '2_7'
      },
      {
        label: '二级 2-8',
        id: '2_8'
      }]
    }, {
      label: '一级 3',
      id: '3',
      children: [{
        label: '二级 3-1',
        id: '3_1',
        children: [{
          label: '三级 3-1-1',
          id: '3_1_1'
        }]
      }, {
        label: '二级 3-2',
        id: '3_2',
        children: [{
          label: '三级 3-2-1',
          id: '3_2_1'
        }]
      }]
    }]);

    return {
      treeData1
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
