<template>
<div class="component-usage">
  <div>
    <h3>基础用法</h3>
    <!--<Basic></Basic>-->
    <BsTable :columns="columns2" :data="data2" stripe border data-row-key="key">
      <!--<template #homeTh="column">
        Home
        <br>
        home
      </template>-->

      <template #name="{ row }">
        <a href="###">{{ row.name }}</a>
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
    Basic
  },
  setup (props: any) {
    const columns1 = [
      {
        label: 'Name',
        prop: 'name'
      },
      {
        label: 'Cash Assets',
        className: 'column-money',
        prop: 'money'
      },
      {
        label: 'Address',
        prop: 'address'
      }
    ];

    const columns2 = [
      {
        label: 'Name',
        prop: 'name'
      },
      {
        label: 'Age',
        prop: 'age'
      },
      {
        // label: 'Home phone',
        label (cellIndex: number) {
          console.log('cellIndex', cellIndex);
          return h('strong', {
            style: {
              color: '#f60'
            }
          }, 'Home');
        },
        colSpan: 2,
        prop: 'tel',
        headSlotName: 'homeTh',
        customHeadCellAttrs () {
          return {
            style: {
              fontSize: '1.2em'
            },
            'data-prop': 'tel'
          };
        },
        customCellAttrs: (row: any, index: number, rowIndex: number) => {
          /* if (index === 2 && (rowIndex == 2 || rowIndex == 3)) {
            return { colSpan: 2 };
          } */
          // These two are merged into above cell
          if (rowIndex === 1) {
            return {
              rowSpan: 3,
              colSpan: 2,
              style: {
                verticalAlign: 'middle',
                textAlign: 'center'
              }
            };
          }
          /* if (rowIndex === 3) {
            return {
              rowSpan: 2,
              // colSpan: 2,
              style: {
                verticalAlign: 'middle',
                textAlign: 'center'
              }
            };
          } */
          /* if (rowIndex === 2) {
            return { rowSpan: 2, colSpan: 2 };
          } */
          /* if (index === 3) {
            return { rowSpan: 0 };
          }
          if (index === 4) {
            return { colSpan: 0 };
          } */
        },
        customCell: (row: any, cellIndex: number, rowIndex: number) => {
          if (rowIndex == 2 || rowIndex == 3) {
            return h('div', {
              style: {
                color: '#007bff',
                textAlign: 'center'
              }
            }, [row.tel]);
          }
          return row.tel;
        }
      },
      {
        label: 'Phone',
        colSpan: 0,
        prop: 'phone'
      },
      {
        label: 'Address',
        prop: 'address'
      }
    ];

    const data2 = ref([
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        tel: '0571-22098909',
        phone: 18889898989,
        address: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        name: 'Jim Green',
        tel: '0571-22098333',
        phone: 18889898888,
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        tel: '0575-22098909',
        phone: 18900010002,
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: '4',
        name: 'Jim Red',
        age: 18,
        tel: '0575-22098909',
        phone: 18900010002,
        address: 'London No. 2 Lake Park',
      },
      {
        key: '5',
        name: 'Jake White',
        age: 18,
        tel: '0575-22098909',
        phone: 18900010002,
        address: 'Dublin No. 2 Lake Park',
      },
    ]);

    setTimeout(function () {
      console.log('移除数据中的第3项');
      data2.value.splice(1, 1);
    }, 1500);
    return {
      columns1,
      columns2,
      data2
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
