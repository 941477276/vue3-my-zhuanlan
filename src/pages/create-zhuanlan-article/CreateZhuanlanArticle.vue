<template>
  <div class="create-zhuanlan-article-page">
    <div class="container">
      <bs-form
        :model="formData">
        <bs-form-item
          label=" ">
          <bs-input
            type="file"
            placeholder="请输入头像"></bs-input>
        </bs-form-item>
        <bs-form-item
          label="文章标题：">
          <bs-input
            v-model="formData.title"
            placeholder="请输入文章标题"></bs-input>
        </bs-form-item>
        <bs-form-item
          label="文章内容：">
          <bs-input
            v-model="formData.content"
            type="textarea"
            rows="6"
            placeholder="请输入文章内容"></bs-input>
        </bs-form-item>
        <bs-button type="primary" block>确定</bs-button>
      </bs-form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive
} from 'vue';

export default defineComponent({
  name: 'CreateZhuanlanArticle',
  setup (props: any) {
    let formData = reactive({
      avatar: '',
      title: '',
      content: ''
    });
    return {
      formData
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
@media (min-width: 1200px) {
  .container{
    width: 960px;
  }
}
</style>
