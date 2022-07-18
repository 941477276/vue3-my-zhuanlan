<template>
  <div class="component-usage">
    <div>
      <h3 style="margin-top: 100px;">基本使用</h3>
      <bs-tree-select
        v-model="checkedKeys1"
        :tree-data="treeData1"
        node-key="id"></bs-tree-select>

      <div>
        <p style="margin: 1rem 0 0 0">显示单选框</p>
        <bs-tree-select
          v-model="checkedKeys1"
          :tree-data="treeData1"
          :radio-visible="true"
          node-key="id"></bs-tree-select>
      </div>

      <div>
        <p style="margin: 1rem 0 0 0">禁用</p>
        <bs-tree-select
          v-model="checkedKeys1"
          :tree-data="treeData1"
          :radio-visible="true"
          disabled
          node-key="id"></bs-tree-select>
      </div>

    </div>
    <div>
      <figure>
        <h3 style="margin-top: 50px;">单选-只能选择叶子节点</h3>
        <figcaption>当<code>multiple=false</code>，且<code>check-strictly=true</code>时，只能选择叶子节点（即没有子节点的节点），否则可以选择任意节点</figcaption>
      </figure>
      <bs-tree-select
        v-model="checkedKeys2"
        :tree-data="treeData1"
        :check-strictly="true"
        node-key="id"
        clearable></bs-tree-select>
    </div>

    <div>
      <figure>
        <h3 style="margin-top: 50px;">多选</h3>
        <figcaption>当<code>multiple=true</code>时，可以多选</figcaption>
      </figure>
      <bs-tree-select
        v-model="checkedKeys3"
        :tree-data="treeData1"
        multiple
        node-key="id"></bs-tree-select>
      <div>
        <p style="margin: 1rem 0 0 0">显示复选框</p>
        <bs-tree-select
          v-model="checkedKeys3"
          :tree-data="treeData1"
          :checkbox-visible="true"
          multiple
          node-key="id"></bs-tree-select>
      </div>
    </div>

    <div>
      <figure>
        <h3 style="margin-top: 50px;">多选-选择任意节点（父子节点不关联）</h3>
        <figcaption>当<code>checkbox-visible=true</code>时，父子节点不再强行关联</figcaption>
      </figure>
      <bs-tree-select
        v-model="checkedKeys4"
        :tree-data="treeData1"
        :checkbox-visible="true"
        :check-strictly="true"
        multiple
        node-key="id"
        clearable></bs-tree-select>
    </div>

    <div>
      <figure>
        <h3 style="margin-top: 50px;">异步加载数据</h3>
        <figcaption>当<code>lazy=true</code>，并且设置`tree-props`的`loadDataFn`属性时，可以异步加载数据</figcaption>
      </figure>
      <bs-tree-select
        v-model="checkedKeys3"
        :tree-data="treeData2"
        :lazy="true"
        :tree-props="{
          loadDataFn: loadDataFn5
        }"
        :checkbox-visible="true"
        :labels="labels5"
        multiple
        node-key="id"
        clearable></bs-tree-select>
    </div>

    <div>
      <figure>
        <h3 style="margin-top: 50px;">可搜索</h3>
        <figcaption>当<code>filter=true</code>时，可以搜索</figcaption>
      </figure>
      <!--<bs-tree-select
        v-model="checkedKeys3"
        :tree-data="treeData2"
        node-key="id"
        clearable></bs-tree-select>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { BsNodeData } from '@/ts-tokens/bootstrap/tree';
import { StringKeyObject } from '@/ts-tokens/bootstrap';
import { BsMessage } from '@/components/bootstrap/bs-message';

function randoms (min: number, max: number): number {
  return parseInt((Math.random() * (max - min + 1) + min) + '');
}

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
    let treeData2 = ref([
      {
        label: '一级 1',
        id: '1',
        children: [
          {
            label: '二级 1-1',
            id: '1_1'
          },
          {
            label: '二级(叶子节点) 1-2',
            id: '1_2',
            isLeaf: true
          },
          {
            label: '二级 1-4',
            id: '1_4'
          }
        ]
      },
      {
        label: '一级 1-5',
        id: '1_5'
      },
      {
        label: '一级 1-6',
        id: '1_6'
      }
    ]);
    // let checkedKeys1 = ref(['1_1', '1_2', '1_3_1', '1_3_2', '1_5_1', '1_6', '1_5_2', '1_5_3']);
    let checkedKeys1 = ref('1_2');
    let checkedKeys2 = ref('');
    let checkedKeys3 = ref(['1_1', '1_2', '1_3_1', '1_5_1', '1_6', '1_5_2', '1_5_3']);
    let checkedKeys4 = ref(['1_1', '1_2', '1_3_1', '1_5_1', '1_6', '1_5_2', '1_5_3']);
    let checkedKeys5 = ref(['1_1', '1_2', '1_3_1', '1_5_1', '1_6', '1_5_2', '1_5_3']);
    let labels5 = ref([
      { label: '1级节点', value: '1_1' },
      { label: '1_2级节点', value: '1_2' },
      { label: '1_3_1级节点', value: '1_3_1' },
      { label: '1_5_1级节点', value: '1_5_1' },
      { label: '1_6级节点', value: '1_6' },
      { label: '1_5_2级节点', value: '1_5_2' },
      { label: '1_5_3级节点', value: '1_5_3' }
    ]);

    // 加载节点函数
    let loadDataFn5 = function (nodeData: BsNodeData, nodeState: StringKeyObject) {
      console.log('nodeData', nodeData);
      return new Promise(function (resolve, reject) {
        let count = Math.floor(Math.random() * 10);
        let nodes: BsNodeData[] = [];

        let leafNodeIndex = -1; // 叶子节点索引
        if (count >= 4) {
          leafNodeIndex = randoms(2, count - 1);
        }
        for (let i = 1; i <= count; i++) {
          nodes.push({
            label: `${nodeState.level + 1}级${leafNodeIndex == i ? '(叶子节点)' : ''} ${i}`,
            id: `${nodeData.id}_${i}`,
            isLeaf: leafNodeIndex == i
          });
        }

        let randomNum = randoms(1, 10);
        let timer = setTimeout(function () {
          clearTimeout(timer);
          if (randomNum % 3 == 0) {
            reject();
            BsMessage.warning?.('节点加载失败!');
            return;
          }
          nodeData.children = nodes;
          resolve(true);
        }, randoms(500, 1500));
      });
    };

    return {
      treeData1,
      treeData2,

      checkedKeys1,
      checkedKeys2,
      checkedKeys3,
      checkedKeys4,
      checkedKeys5,

      labels5,

      loadDataFn5
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  padding: 100px 0;
}
.bs-tree-select {
  width: auto;
}
</style>
