<template>
<div class="zhuanlan-article-detail-page">
  <div class="container">
    <img :src="article.image ? article.image.url : ''" :alt="article.title" class="zhuanlan-article-poster">
    <h1 class="zhuanlan-article-title">{{ article.title }}</h1>
    <div class="author-info">
      <img :src="article.author?.avatar?.url || ''" :alt="article.author?.nickName" class="author-avatar">
      <dl>
        <dt>{{ article.author?.nickName }}</dt>
        <dd class="article-created-time">{{ article.createdAt }}</dd>
      </dl>
    </div>
    <article class="article-content" v-html="article.content"></article>
    <div class="article-operate" v-if="userInfo._id == article.author?.id">
      <bs-button type="primary">编辑</bs-button>
      <bs-button type="danger">删除</bs-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { articleApi } from '@/apis/articleApi';

export default defineComponent({
  name: 'ZhuanlanArticleDetail',
  setup () {
    let route = useRoute();
    let store = useStore();
    let id = ref('');
    let article = ref({});
    let userInfo = computed(function () {
      return store.state.userInfo;
    });
    let getArticle = function () {
      articleApi.getDetail(id.value)
        .then(res => {
          article.value = res.data;
        });
    };

    onMounted(function () {
      id.value = route.params.id as string;
      getArticle();
    });
    return {
      article,
      userInfo,
      getArticle
    };
  }
});
</script>

<style lang="scss" scoped>
@import "zhuanlan-article-detail";
</style>
