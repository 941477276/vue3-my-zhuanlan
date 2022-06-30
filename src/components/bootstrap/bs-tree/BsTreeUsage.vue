<template>
  <div class="component-usage">
    <div class="container">
      <!--<div>
        <h3>基本使用</h3>
        <bs-tree
          v-if="show"
          :tree-data="treeData1"
          node-key="id"
          :show-checkbox="true"
          :highlightCurrent="true"
          :autoExpandParent="true"
          :page-size="2"
          :expandedKeys="['2_1_1_2', '3', '4']"
          v-model:checkedKeys="checkedKeys1">
          <template #default="{data}">
            <strong>
              {{ data.label }}
            </strong>
          </template>
        </bs-tree>
        <bs-button type="primary" @click="addNode" style="margin-top: 1rem">添加一级</bs-button>
        <bs-button type="primary" @click="removeNode" style="margin-top: 1rem">移除一级</bs-button>
        <br>
        <bs-button type="primary" @click="addCheckedKeys" style="margin-top: 1rem">选中项</bs-button>
        <bs-button type="primary" @click="show = !show" style="margin-top: 1rem">显示/销毁树</bs-button>
      </div>-->
      <!--<div>
        <h3>动态加载</h3>
        <bs-tree
          :tree-data="treeData2"
          :lazy="true"
          :load-data-fn="loadNode"
          :show-checkbox="true"
          :expanded-keys="['1', '1_1', '1_1_1', '1_3', '1_3_2']"
          v-model:checkedKeys="checkedKeys2"
          node-key="id">
        </bs-tree>
      </div>-->
      <div>
        <h3>禁用</h3>
        <bs-tree
          :tree-data="treeData3"
          :show-checkbox="true"
          :defaultExpandAll="true"
          v-model:checkedKeys="checkedKeys2"
          node-key="id">
        </bs-tree>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BsMessage } from '@/components/bootstrap/bs-message';
import {
  BsNodeData
} from '@/ts-tokens/bootstrap/tree';
import {
  StringKeyObject
} from '@/ts-tokens/bootstrap';

function randoms (min: number, max: number): number {
  return parseInt((Math.random() * (max - min + 1) + min) + '');
}
export default defineComponent({
  name: 'BsTreeUsage',
  setup () {
    let treeData1 = ref([
      {
        label: '一级 1',
        id: '1',
        children: [
          {
            label: '二级 1-1',
            id: '1_1',
            children: [
              {
                label: '三级 1-1-1',
                id: '1_1_1'
              }
            ]
          }
        ]
      },
      {
        label: '一级 2',
        id: '2',
        children: [
          {
            label: '二级 2-1',
            id: '2_1',
            children: [
              {
                label: '三级 2-1-1',
                id: '2_1_1',
                children: [
                  {
                    label: '四级 2-1-1-1',
                    id: '2_1_1_1'
                  },
                  {
                    label: '四级 2-1-1-2',
                    id: '2_1_1_2',
                    children: [
                      {
                        label: '五级 2-1-1-2-1',
                        id: '2_1_1_2_1'
                      },
                      {
                        label: '五级 2-1-1-2-2',
                        id: '2_1_1_2_2'
                      },
                      {
                        label: '五级 2-1-1-2-3',
                        id: '2_1_1_2_3'
                      },
                      {
                        label: '五级 2-1-1-2-4',
                        id: '2_1_1_2_4'
                      },
                      {
                        label: '五级 2-1-1-2-5',
                        id: '2_1_1_2_5'
                      }
                    ]
                  },
                  {
                    label: '四级 2-1-1-3',
                    id: '2_1_1_3'
                  },
                  {
                    label: '四级 2-1-1-4',
                    id: '2_1_1_4'
                  }
                ]
              }
            ]
          },
          {
            label: '二级 2-2',
            id: '2_2',
            children: [
              {
                label: '三级 2-2-1',
                id: '2_2_1'
              }
            ]
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
          }
        ]
      },
      {
        label: '一级 3',
        id: '3',
        children: [
          {
            label: '二级 3-1',
            id: '3_1',
            children: [
              {
                label: '三级 3-1-1',
                id: '3_1_1'
              }
            ]
          },
          {
            label: '二级 3-2',
            id: '3_2',
            children: [
              {
                label: '三级 3-2-1',
                id: '3_2_1'
              },
              {
                label: '三级 3-2-2',
                id: '3_2_2'
              }
            ]
          }
        ]
      }
    ]);

    // let checkedKeys1 = ref<(string|number)[]>(['4', '2_1', '2_4', '2_2', '2_5', '2_2_1', '2_1_1_2_2', '3_2_1']);
    let checkedKeys1 = ref<(string | number)[]>([]);
    let show = ref(true);

    let addNode = function () {
      let length = treeData1.value.length;
      treeData1.value.push({
        label: (length + 1) + '级',
        id: '' + (length + 1),
        children: [
          {
            label: (length + 1) + '_1级',
            id: '' + (length + 1) + '_1',
            children: []
          }
        ]
      });
    };

    let removeNode = function () {
      if (treeData1.value.length >= 4) {
        treeData1.value.pop();
      }
    };

    let addCheckedKeys = function () {
      if (checkedKeys1.value.length > 0) {
        return;
      }
      let checkedKesArr = checkedKeys1.value;
      ['4', '2_1', '2_4', '2_2', '2_5', '2_2_1', '2_1_1_2_2', '3_2_1', '2_1_1_2_3', '2_1_1_2_5'].forEach(item => {
        checkedKesArr.push(item);
      });
    };

    let treeData2 = ref([{
      label: '一级 1',
      id: '1',
      children: [
        {
          label: '二级 1-1',
          id: '1_1',
          children: [
            {
              label: '三级 1-1-1',
              id: '1_1_1'
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
          id: '1_3'
        }
      ]
    }]);
    let checkedKeys2 = ref(['1_1', '1_2', '1_3_1', '1_3_2', '1_3_3', '1_3_2_2']);
    // 加载节点函数
    let loadNode = function (nodeData: BsNodeData, nodeState: StringKeyObject) {
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
        }, randoms(1000, 3000));
      });
    };

    let treeData3 = ref([{
      label: '一级 1',
      id: '1',
      children: [
        {
          label: '二级 1-1',
          id: '1_1',
          disabled: true,
          children: [
            {
              label: '三级 1-1-1',
              id: '1_1_1',
              disabled: true
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
          disabled: true,
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
    }]);
    let checkedKeys3 = ref(['1_1', '1_2', '1_3', '1_3_1', '1_3_2', '1_3_3', '1_3_2_2']);

    return {
      treeData1,
      checkedKeys1,
      show,

      treeData2,
      checkedKeys2,
      loadNode,

      treeData3,
      checkedKeys3,

      addNode,
      removeNode,
      addCheckedKeys
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
