<template>
  <div class="component-usage">
    <div>
      <h3>分页器</h3>
      <bs-pagination
        size=""
        data-layout="total,sizes,pager,slot,jumper"
        :total="pageData.total"
        :pager-count="7"
        v-model:pageSize="pageData.pageSize"
        v-model:current-page="pageData.currentPage">
        【哈哈】
      </bs-pagination>
    </div>

    <div>
      <hr>
      <h3>小号分页器</h3>
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

    <div>
      <hr>
      <h3>大号分页器</h3>
      <bs-pagination
        size="lg"
        layout="total,sizes,pager,slot,jumper"
        :total="pageData.total"
        :pager-count="7"
        :hideOnSinglePage="false"
        v-model:pageSize="pageData.pageSize"
        v-model:current-page="pageData.currentPage">
      </bs-pagination>
    </div>

    <div>
      <hr>
      <h3>禁用项</h3>
      <bs-pagination
        :total="pageData.total"
        :pager-count="5"
        :hideOnSinglePage="false"
        :disabled-page="[3,4,7,8,11]"
        v-model:pageSize="pageData.pageSize"
        v-model:current-page="pageData.currentPage2">
      </bs-pagination>
    </div>
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
      currentPage2: 1,
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
