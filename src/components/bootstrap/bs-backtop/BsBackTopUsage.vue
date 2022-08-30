<template>
  <div class="component-usage">
    <BsBackTop></BsBackTop>

    <h3>在DOM容器内（按钮绝对定位，<code>target="#scrollBox1"</code>）</h3>
    <div class="scroll-box" id="scrollBox1">
      <div class="scroll-content">
        <BsBackTop
          target="#scrollBox1"
          style="bottom: auto;">
        </BsBackTop>
      </div>
    </div>

    <hr>
    <h3>在DOM容器内（按钮固定定位</h3>
    <div class="scroll-box" style="height: 200px">
      <div class="scroll-content" style="height: 100px;">
        <BsBackTop visibility-height="20%" style="bottom: 50%;">
          <div class="custom-back-top" title="自定义返回顶部按钮">
            Back <br>
            Top
          </div>
        </BsBackTop>
      </div>
    </div>

    <hr>
    <h3>在DOM容器内（按钮绝对定位，<code>target为一个函数</code>）</h3>
    <div class="scroll-box" id="scrollBox2">
      <div class="scroll-content">
        <BsBackTop
          :target="getTarget1"
          style="bottom: auto;"></BsBackTop>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsBackTop from './BsBackTop.vue';

export default defineComponent({
  name: 'BsBackTopUsage',
  components: {
    BsBackTop
  },
  setup () {
    return {
      getTarget1 () {
        return document.getElementById('scrollBox2');
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  min-height: 1800px;
}
.scroll-box{
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;
  overflow: auto;
}
.scroll-content{
  height: 1560px;
}
.custom-back-top{
  padding: 5px 10px;
  color: #fff;
  background-color: var(--primary);
}
</style>
