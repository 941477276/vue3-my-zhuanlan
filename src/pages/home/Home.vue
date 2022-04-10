<template>
  <div class="home-page">
    <div class="container">
      <div class="writing-guide">
        <img src="../../assets/imgs/home_img.png" alt="写作向导">
        <bs-button
          type="primary"
          class="start-write-btn"
          @click="toWriteArticle">开始写作</bs-button>
      </div>

      <!--推荐的专栏列表 start-->
      <div class="recommend-zhuanlan-list">
        <ZhuanlanItem
          v-for="item in columns"
          :key="item._id"
          :column="item"></ZhuanlanItem>
      </div>
      <div class="loadmore-btn-wrap" v-if="totalPage > 1">
        <bs-button
          type="primary"
          :loading="loading"
          :disabled="loading || currentPage === totalPage"
          @click="loadMoreColumn">
          {{ currentPage === totalPage ? '没有更多了～': '加载更多' }}
        </bs-button>
      </div>
      <!--推荐的专栏列表 end-->
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';
import ZhuanlanItem from './widgets/zhuanlan-item/ZhuanlanItem.vue';
import { useRouter } from 'vue-router';
import { columnApi } from '@/apis/columnApi';

export default defineComponent({
  name: 'Home',
  components: {
    ZhuanlanItem
  },
  setup () {
    let router = useRouter();

    let loading = ref(false);
    let columns = ref<any[]>([]);
    let currentPage = ref(1);
    let pageSize = ref(3);
    let total = ref(0);
    let totalPage = ref(0);

    let getColumns = function () {
      loading.value = true;
      columnApi.getList(currentPage.value, pageSize.value)
        .then(res => {
          loading.value = false;
          let data = res.data;
          columns.value = [...columns.value, ...data.list];
          total.value = data.count;
          totalPage.value = Math.ceil(data.count / pageSize.value);
        })
        .catch(() => {
          loading.value = false;
        });
    };
    getColumns();

    let toWriteArticle = function () {
      router.push('/create-zhuanlan-article');
    };
    // 加载更多专栏
    let loadMoreColumn = function () {
      if (currentPage.value == totalPage.value) {
        return;
      }
      currentPage.value++;
      getColumns();
    };
    return {
      toWriteArticle,
      loadMoreColumn,

      loading,
      columns,
      currentPage,
      totalPage
    };
  }
});
</script>

<style lang="scss" scoped>
@import "home";
</style>
