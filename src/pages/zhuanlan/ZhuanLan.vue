<template>
  <div class="zhuanlan-page">
    <div class="container">
      <!--专栏信息 start-->
      <div class="zhuanlan-info">
        <div class="zhuanlan-info-container">
          <figure>
            <figcaption>{{ columnDetail.title }}</figcaption>
            <p class="zhuanlan-desc">{{ columnDetail.description }}</p>
          </figure>
          <img :src="columnDetail.avatar ? columnDetail.avatar.url : ''" :alt="columnDetail.title" class="zhuanlan-avatar">
        </div>
      </div>
      <!--专栏信息 end-->

      <!--专栏文章列表 start-->
      <ol class="article-list" v-if="articles.length > 0">
        <li
          class="article-item"
          v-for="article in articles"
          :key="article._id">
          <router-link
            class="article-link"
            :to="`/zhuanlan-article-detail/${article._id}`">
            <h6>{{ article.title }}</h6>
            <figure>
              <img :src="article.image ? article.image.url : ''" :alt="article.title" class="article-poster-img">
              <p class="article-short-desc">{{ article.excerpt }}</p>
            </figure>
          </router-link>
        </li>
      </ol>
      <div v-if="articles.length === 0 && columnId === userInfo.column">
        <h4 class="no-article-tips">
          您的专栏里一篇文章都没有，立即去
          <router-link to="/create-zhuanlan-article">创建一篇文章</router-link>
          吧！
        </h4>
      </div>
      <div class="article-list-loadmore" v-if="pageData.totalPage > 1">
        <bs-button
          :loading="articleLoading"
          :disabled="articleLoading || pageData.current >= pageData.totalPage"
          @click="loadMoreArticle">
          {{ pageData.current >= pageData.totalPage ? '没有更多了～' : '加载更多' }}
        </bs-button>
      </div>
      <!--专栏文章列表 end-->
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  onMounted
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { columnApi } from '@/apis/columnApi';
import { articleApi } from '@/apis/articleApi';

export default defineComponent({
  name: 'ZhuanLan',
  setup () {
    let route = useRoute();
    let store = useStore();
    let columnId = ref('');

    let userInfo = computed(function () {
      return store.state.userInfo;
    });

    // 专栏详情
    let columnDetail = ref({});
    let getColumnDetail = function () {
      columnApi.getDetail(columnId.value)
        .then(res => {
          columnDetail.value = res.data;
        });
    };

    let pageData = reactive({
      pageSize: 3,
      current: 1,
      total: 0,
      totalPage: 0
    });
    let articleLoading = ref(false);
    let articles = ref<any[]>([]);
    let getArticles = function () {
      articleLoading.value = true;
      articleApi.getListByColumnId(columnId.value, pageData.current, pageData.pageSize)
        .then(res => {
          articleLoading.value = false;
          let data = res.data;
          articles.value = [...articles.value, ...data.list];
          pageData.total = data.count;
          pageData.totalPage = Math.ceil(data.count / pageData.pageSize);
        })
        .catch(function () {
          articleLoading.value = false;
        });
    };
    let loadMoreArticle = function () {
      if (articleLoading.value || pageData.current >= pageData.totalPage) {
        return;
      }
      pageData.current++;
      getArticles();
    };

    onMounted(function () {
      columnId.value = route.params.id as string;
      getColumnDetail();
      getArticles();
    });

    return {
      columnId,
      columnDetail,
      articles,
      pageData,
      articleLoading,
      userInfo,

      loadMoreArticle
    };
  }
});
</script>

<style lang="scss" scoped>
@import "zhuanlan";
</style>
