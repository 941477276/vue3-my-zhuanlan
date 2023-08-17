<template>
  <div class="component-usage">
    <div>
      <!--<h3>基础用法</h3>-->
      <!--<Basic></Basic>-->
      <BsTable :columns="columns2" :data="data2" stripe border max-height="400" row-key="value" selection="radio"
               :default-expand-all-rows="false" :default-expanded-row-keys="expandedRowKeys" :checked-keys="checkedKeys"
                :selection-config="{
                  type: 'checkbox',
                  selectedRowKeys,
                  rowDisabled,
                  checkStrictly: false,
                  onSelectChange
                }">
        <!--<template #headSelectionExtra>
          More
        </template>-->

        <template #opt>
          <bs-button type="primary" size="sm">Edit</bs-button>
          <bs-button type="danger" size="sm" style="margin-left: 0.5rem;">Delete</bs-button>
        </template>
      </BsTable>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, h } from 'vue';
import Basic from './demos/basic.vue';

export default defineComponent({
  name: 'BsTableUsage',
  components: {
    // Basic
  },
  setup (props: any) {
    const columns2 = [
      {
        label: 'Area name',
        prop: 'title',
        minWidth: 160
      },
      {
        label: 'Key',
        prop: 'key',
        minWidth: 180,
        showTooltip: true,
        resizeable: true
      },
      {
        label: 'Value',
        prop: 'value',
        ellipsis: true,
        resizeable: true
      },
      {
        label: 'Operate',
        prop: 'opt',
        minWidth: 140,
        resizeable: true
      }
    ];

    const data2 = ref([
      {
        'title': '佛山市',
        'key': '64c204f08cdedc661690ffd9',
        'value': '001003'
      },
      {
        'children': [
          {
            'title': '越秀区',
            'key': '64c204e68cdedc661690ffd8',
            'value': '001002002'
          },
          {
            'title': '增城区',
            'key': '64c204d98cdedc661690ffd7',
            'value': '001002001'
          }
        ],
        'title': '广州市',
        'key': '64c204cb8cdedc661690ffd2',
        'value': '001002'
      },
      {
        'children': [
          {
            'title': '福田区',
            'key': '64c204138cdedc661690ffbd',
            'value': '001001003',
            'isLeaf': true
          },
          {
            'children': [
              {
                'title': '新安街道',
                'key': '64c204c28cdedc661690ffd1',
                'value': '001001002003'
              },
              {
                'title': '西乡街道',
                'key': '64c204b28cdedc661690ffd0',
                'value': '001001002002'
              }
            ],
            'title': '宝安区',
            'key': '64c204098cdedc661690ffbc',
            'value': '001001002'
          },
          {
            'children': [
              {
                'title': '吉华街道',
                'key': '64c2043d8cdedc661690ffc4',
                'value': '001001001003',
                'isLeaf': true
              },
              {
                'children': [
                  {
                    'title': '布吉一街',
                    'key': '64c2045e8cdedc661690ffc9',
                    'value': '001001001002001'
                  },
                  {
                    'title': '荣超花园',
                    'key': '64c204798cdedc661690ffca',
                    'value': '001001001002002'
                  }
                ],
                'title': '布吉街道',
                'key': '64c2042a8cdedc661690ffc3',
                'value': '001001001002'
              },
              {
                'title': '坂田街道',
                'key': '64c204228cdedc661690ffc2',
                'value': '001001001001'
              }
            ],
            'title': '龙岗区',
            'key': '64b5e8c4fc205615f7314d9a',
            'value': '001001001'
          }
        ],
        'title': '深圳市',
        'key': '64b5e8bafc205615f7314d95',
        'value': '001001'
      }
    ]);

    setTimeout(function () {
      data2.value[0].key = '阿什拉夫卢卡斯金六福酒快睡觉false发链接库萨分类扫房埃里克分类可撒娇法律手段flsd';
    }, 1500);

    setTimeout(function () {
      data2.value.push({
        'title': '清远市',
        'key': '64c204f08cdedc661690eed9',
        'value': '001004'
      });
    }, 1500);

    let expandedRowKeys = ref(['001001001002002', '001002']);
    let selectedRowKeys = ref(['001001001001', '001001001002002', '001001001002001', '001002']);
    return {
      columns2,
      data2,
      expandedRowKeys,
      selectedRowKeys,
      rowDisabled (row: Record<string, any>) {
        // return ['坂田街道', '吉华街道'].includes(row.title);
      },
      onSelectChange (selection: any) {
        console.log('selection', selection);
        // checkedKeys.value = selection.selectedRowKeys;
      }
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
