<template>
  <div class="home-page">
    <div class="container">
      <div class="writing-guide">
        <img src="../../assets/imgs/home_img.png" alt="写作向导">
        <bs-button
          type="primary"
          class="start-write-btn">开始写作</bs-button>
      </div>

      <!--推荐的专栏列表 start-->
      <div class="recommend-zhuanlan-list">
        <ZhuanlanItem></ZhuanlanItem>
        <ZhuanlanItem></ZhuanlanItem>
        <ZhuanlanItem></ZhuanlanItem>
        <ZhuanlanItem></ZhuanlanItem>
        <ZhuanlanItem></ZhuanlanItem>
        <ZhuanlanItem></ZhuanlanItem>
        <ZhuanlanItem></ZhuanlanItem>
        <ZhuanlanItem></ZhuanlanItem>
      </div>
      <!--推荐的专栏列表 end-->
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import ZhuanlanItem from './widgets/zhuanlan-item/ZhuanlanItem.vue';

export default defineComponent({
  name: 'Home',
  components: {
    ZhuanlanItem
  }
});
</script>

<style lang="scss" scoped>
@import "home";
</style>
