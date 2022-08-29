<template>
  <div class="component-usage">
    <BsBackTop></BsBackTop>

    <div class="scroll-box" id="scrollBox1">
      <div class="scroll-content">
        <BsBackTop
          target="#scrollBox1"
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
</style>
