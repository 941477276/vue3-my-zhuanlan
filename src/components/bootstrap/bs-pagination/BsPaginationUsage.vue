<template>
  <div class="component-usage">
    <h1>分页器</h1>
    <bs-pagination
      size=""
      data-layout="total,sizes,pager,slot,jumper"
      :total="pageData.total"
      :pager-count="7"
      v-model:pageSize="pageData.pageSize"
      v-model:current-page="pageData.currentPage">
      【哈哈】
    </bs-pagination>

    <h1>小号分页器</h1>
    <bs-pagination
      size="sm"
      layout="total,sizes,pager,slot,jumper"
      :total="pageData.total"
      :pager-count="7"
      :hideOnSinglePage="false"
      v-model:pageSize="pageData.pageSize"
      v-model:current-page="pageData.currentPage">
    </bs-pagination>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive
} from 'vue';

export default defineComponent({
  name: 'BsPaginationUsage',
  setup () {
    let pageData = reactive({
      total: 153,
      currentPage: 6,
      pageSize: 10
    });
    return {
      pageData
    };
  }
});
</script>

<style lang="scss">
h1{
  margin: 30px 0 10px 0;
}
</style>
