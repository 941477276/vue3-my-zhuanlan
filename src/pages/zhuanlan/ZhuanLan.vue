<template>
  <div class="zhuanlan-page">
    <div class="container">
      <!--专栏信息 start-->
      <div class="zhuanlan-info">
        <div class="zhuanlan-info-container">
          <figure>
            <figcaption>我的专栏</figcaption>
            <p class="zhuanlan-desc">副书记翻领宽松的翻领宽松的费拉达斯父克拉森可夫拉萨弗拉索夫空间阿什拉夫是的</p>
          </figure>
          <img src="../../assets/logo.png" alt="" class="zhuanlan-avatar">
        </div>
      </div>
      <!--专栏信息 end-->

      <!--专栏文章列表 start-->
      <ol class="article-list">
        <li class="article-item">
          <router-link class="article-link" to="/">
            <h6>文章标题</h6>
            <figure>
              <img src="../../assets/imgs/code.png" alt="" class="article-poster-img">
              <p class="article-short-desc">
                层叠样式表(英文全称：Cascading Style Sheets)是一种用来表现HTML（标准通用标记语言的一个应用）或XML（标准通用标记语言的一个子集）等文件样式的计算机语言。CSS不仅可以静态地修饰网页，还可以配合各种脚本语言动态地对网页各元素进行格式化。
              </p>
            </figure>
          </router-link>
        </li>
        <li class="article-item">
          <router-link class="article-link" to="/aa">
            <h6>文章标题</h6>
            <figure>
              <!--<img src="../../assets/imgs/code.png" alt="" class="article-poster-img">-->
              <p class="article-short-desc">
                层叠样式表(英文全称：Cascading Style Sheets)是一种用来表现HTML（标准通用标记语言的一个应用）或XML（标准通用标记语言的一个子集）等文件样式的计算机语言。CSS不仅可以静态地修饰网页，还可以配合各种脚本语言动态地对网页各元素进行格式化。
              </p>
            </figure>
          </router-link>
        </li>
        <li class="article-item">
          <router-link class="article-link" to="/c">
            <h6>文章标题</h6>
            <figure>
              <img src="../../assets/imgs/code.png" alt="" class="article-poster-img">
              <p class="article-short-desc">
                层叠样式表(英文全称：Cascading Style Sheets)是一种用来表现HTML（标准通用标记语言的一个应用）或XML（标准通用标记语言的一个子集）等文件样式的计算机语言。CSS不仅可以静态地修饰网页，还可以配合各种脚本语言动态地对网页各元素进行格式化。
              </p>
            </figure>
          </router-link>
        </li>
      </ol>
      <!--专栏文章列表 end-->
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'ZhuanLan'
});
</script>

<style lang="scss" scoped>
@import "zhuanlan";
</style>
