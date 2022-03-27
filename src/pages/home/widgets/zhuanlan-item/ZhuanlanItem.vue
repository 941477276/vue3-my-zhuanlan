<template>
<div class="zhuanlan-item">
  <img src="../../../../assets/logo.png" alt="" class="zhuanlan-avatar">
  <dl>
    <dt class="zhuanlan-title">李先生的专栏</dt>
    <dd class="zhuanlan-desc">这是李先生的专栏，一个非常有趣的专栏！</dd>
  </dl>
  <div class="text-center">
    <bs-button class="to-zhuanlan-btn" type="primary" plain>进入专栏</bs-button>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'ZhuanlanItem'
});
</script>

<style lang="scss" scoped>
.zhuanlan-item{
  padding: 1.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 0.25rem;
  background-color: #fff;
}
.zhuanlan-avatar{
  display: block;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin: 0 auto 0.8rem auto;
}
.zhuanlan-title{
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.15rem;
  text-align: center;
}
.zhuanlan-desc{
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
