<template>
  <div class="create-zhuanlan-article-page">
    <div class="container">
      <bs-form
        ref="formRef"
        :rules="rules"
        :model="formData">
        <bs-form-item
          label=" ">
          <img
            v-if="articlePoster"
            :src="articlePoster" alt="" class="article-poster">
          <bs-input
            type="file"
            placeholder="请输入头像"
            :disabled="articlePosterUploading"
            @change="onFileChange"></bs-input>
        </bs-form-item>
        <bs-form-item
          label="文章标题："
          field-prop-name="title">
          <bs-input
            v-model="formData.title"
            placeholder="请输入文章标题"></bs-input>
        </bs-form-item>
        <bs-form-item
          label="文章内容："
          field-prop-name="content">
          <bs-input
            v-model="formData.content"
            type="textarea"
            rows="6"
            placeholder="请输入文章内容"></bs-input>
        </bs-form-item>
        <bs-button
          type="primary"
          block
          :loading="committing"
          :disabled="committing || (articleDetail.author?._id !== userInfo._id)"
          @click="submitData">确定</bs-button>
      </bs-form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  onMounted
} from 'vue';
import { accountUtil } from '@/common/accountUtil';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import rules from './useRules';
import { uploadFile } from '@/apis/uploadApi';
import { BsMessage, closeMessage } from '@/components/bootstrap/bs-message';
import { articleApi } from '@/apis/articleApi';

export default defineComponent({
  name: 'CreateZhuanlanArticle',
  setup (props: any) {
    let store = useStore();
    let route = useRoute();
    let router = useRouter();
    let formRef = ref(null);
    let committing = ref(false);
    let articleId = ref('');
    let articleDetail = ref({});
    let formData = reactive({
      image: '',
      title: '',
      content: ''
    });

    let userInfo = computed(function () {
      return store.state.userInfo;
    });

    let articlePoster = ref(null);
    let articlePosterUploading = ref(false);
    let onFileChange = function (evt: InputEvent) {
      let file = (evt.target as any).files[0];
      if (articlePosterUploading.value) {
        return;
      }
      let bsMessageId = BsMessage.info?.('图片上传中。。。') as string;
      uploadFile(file)
        .then(res => {
          articlePosterUploading.value = false;
          closeMessage(bsMessageId);
          articlePoster.value = res.data.url;
          BsMessage.success?.('图片上传成功！');
        })
        .catch(function () {
          closeMessage(bsMessageId);
          articlePosterUploading.value = false;
        });
    };

    let getArticle = function () {
      articleApi.getDetail(articleId.value)
        .then(res => {
          let data = res.data;
          articleDetail.value = data;
          formData.title = data.title;
          formData.content = data.content;
          articlePoster.value = data.image?.url;
        });
    };

    let submitData = function () {
      if (committing.value || articlePosterUploading.value) {
        return;
      }
      (formRef.value as any).validate()
        .then(() => {
          committing.value = true;
          let promise;
          if (articleId.value) {
            promise = articleApi.update((articleDetail.value as any)._id, {
              title: formData.title,
              content: formData.content,
              image: articlePoster.value || formData.image
            });
          } else {
            promise = articleApi.create({
              title: formData.title,
              content: formData.content,
              image: articlePoster.value || formData.image,
              column: userInfo.value.column,
              author: userInfo.value._id
            });
          }
          promise.then(() => {
            committing.value = false;
            BsMessage.success?.(articleId.value ? '文章修改成功' : '创建文章成功！');
            router.push(`/zhuanlan/${userInfo.value.column}`);
          })
            .catch(() => {
              committing.value = false;
            });
        });
    };

    onMounted(function () {
      articleId.value = route.params.id as string;
      if (articleId.value) {
        getArticle();
      }
    });

    return {
      formData,
      rules,
      formRef,
      committing,
      articlePosterUploading,
      articleDetail,
      articlePoster,
      userInfo,

      onFileChange,
      submitData
    };
  }
});
</script>

<style lang="scss" scoped>
h1{
  padding: 2rem 0;
  text-align: center;
}
.bs-form{
  margin-bottom: 2rem;
}
.bs-input{
  width: 100%;
}
.article-poster{
  display: block;
  width: 160px;
  margin-bottom: 1rem;
}
@media (min-width: 1200px) {
  .container{
    width: 960px;
  }
}
</style>
