<template>
<div class="component-usage">
  <div>
    <h3>基础用法</h3>
    <!--<Basic></Basic>-->
    <BsTable :columns="columns2" :data="data2" stripe border max-height="290" row-key="id">
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

    const columns2 = [
      {
        label: 'Date',
        prop: 'date',
        width: 150
      },
      {
        label: 'Name',
        prop: 'name',
        width: 130
      },
      {
        label: 'Address',
        prop: 'address',
        minWidth: 200
      }
    ];

    const data2 = ref([
      {
        id: '1',
        name: 'John Brown',
        date: '2023-07-09',
        address: 'New York No. 1 Lake Park'
      },
      {
        id: '2',
        name: 'Jim Green',
        date: '2023-07-10',
        address: 'London No. 1 Lake Park'
      },
      {
        id: '3',
        name: 'Joe Black',
        date: '2023-07-17',
        address: 'Sidney No. 1 Lake Park'
      },
      {
        id: '4',
        name: 'Jim Red',
        date: '2023-08-01',
        address: 'London No. 2 Lake Park'
      },
      {
        id: '5',
        name: 'Jake White',
        date: '2023-08-13',
        address: 'Dublin No. 2 Lake Park'
      },
      {
        id: '6',
        name: 'Jake Lee',
        date: '2023-08-19',
        address: 'Dublin No. 2 Lake Park'
      },
      {
        id: '7',
        name: 'Optimus Prime',
        date: '2023-08-23',
        address: 'Dublin No. 2 Lake Park'
      },
      {
        id: '8',
        name: 'Bumblebee',
        date: '2023-09-09',
        address: 'Dublin No. 2 Lake Park'
      }
    ]);

    return {
      columns2,
      data2
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
