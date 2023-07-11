<template>
<div class="component-usage">
  <div>
    <h3>基础用法</h3>
    <!--<Basic></Basic>-->
    <BsTable :columns="columns2" :data="data2" stripe border max-height="400" row-key="id">
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
    Basic
  },
  setup (props: any) {
    const columns2 = [
      {
        label: 'ID',
        prop: 'id',
        fixed: true
      },
      {
        label: 'UserName',
        prop: 'name',
        width: 130,
        fixed: 'left'
      },
      {
        label: 'Email',
        prop: 'email',
        minWidth: 150
      },
      {
        label: 'Phone',
        prop: 'phone',
        minWidth: 160
      },
      {
        label: 'Hobbies',
        prop: 'hobbies',
        minWidth: 200
      },
      {
        label: 'Job',
        prop: 'job',
        minWidth: 100
      },
      {
        label: 'CreatedTime',
        prop: 'createdTime',
        width: 150
      },
      {
        label: 'Address',
        prop: 'address',
        minWidth: 200,
        fixed: 'right'
      },
      {
        label: 'Operates',
        prop: 'opt',
        minWidth: 160,
        fixed: 'right'
      }
    ];

    const data2 = ref([
      {
        id: '1',
        name: 'John Brown',
        date: '2023-07-09',
        email: 'user1@bts.com',
        phone: '13112345678',
        job: 'Web front developer',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
        address: 'New York No. 1 Lake Park'
      },
      {
        id: '2',
        name: 'Jim Green',
        date: '2023-07-10',
        email: 'user2@bts.com',
        phone: '13212345678',
        job: 'java developer',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
        address: 'London No. 1 Lake Park'
      },
      {
        id: '3',
        name: 'Joe Black',
        date: '2023-07-17',
        email: 'user3@bts.com',
        phone: '13312345678',
        job: 'UI',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
        address: 'Sidney No. 1 Lake Park'
      },
      {
        id: '4',
        name: 'Jim Red',
        date: '2023-08-01',
        email: 'user4@bts.com',
        phone: '13412345678',
        job: 'tester',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
        address: 'London No. 2 Lake Park'
      },
      {
        id: '5',
        name: 'Jake White',
        date: '2023-08-13',
        email: 'user5@bts.com',
        phone: '13512345678',
        job: 'android developer',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
        address: 'Dublin No. 2 Lake Park'
      },
      {
        id: '6',
        name: 'Jake Lee',
        date: '2023-08-19',
        email: 'user6@bts.com',
        phone: '13612345678',
        job: 'ios developer',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
        address: 'Dublin No. 2 Lake Park'
      },
      {
        id: '7',
        name: 'Optimus Prime',
        date: '2023-08-23',
        email: 'user7@bts.com',
        phone: '13712345678',
        job: 'flutter developer',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
        address: 'Dublin No. 2 Lake Park'
      },
      {
        id: '8',
        name: 'Bumblebee',
        date: '2023-09-09',
        email: 'user8@bts.com',
        phone: '13812345678',
        job: 'Web front developer',
        createdTime: '2023-07-09 16:24:35',
        hobbies: ['movies', 'music', 'code'],
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
