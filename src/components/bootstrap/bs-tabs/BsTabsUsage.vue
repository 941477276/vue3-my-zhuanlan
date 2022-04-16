<template>
<div class="component-usage">
  <h3>基础用法</h3>
  <div class="max-w-600">
    <bs-tabs closeable></bs-tabs>
  </div>

  <!--<br>
  <hr>
  <div style="max-width: 400px;">
    <bs-tabs v-model="tab2"></bs-tabs>
  </div>-->

  <br>
  <hr>
  <div style="max-width: 400px;">
    <bs-tabs v-model="tab2" triggerTypeOnOverflow="more"></bs-tabs>
  </div>

  <br>
  <!--<br>
  <div class="max-w-600" style="overflow-x: scroll;white-space: nowrap;">
    <span>aaaaaaaaaaaaaaaa</span><bs-tabs style="display: inline-block;max-width: 500px;margin: 0 20px;"></bs-tabs>
  </div>
  <br>
  <br>-->
  <!--<bs-tabs></bs-tabs>-->

  <!--<hr>
  <h3>高亮条两端向外延伸长度为20px(inkBarSpaceBetween = 10)</h3>
  <bs-tabs :inkBarSpaceBetween="10"></bs-tabs>-->

  <hr>
  <h3>靠左</h3>
  <div class="max-w-600">
    <bs-tabs
      tabBarMaxHeight="200px"
      tab-position="left"
      data-triggerTypeOnOverflow="more"></bs-tabs>
  </div>

  <hr>
  <h3>靠右</h3>
  <div class="max-w-600">
    <bs-tabs
      tabBarMaxHeight="280px"
      :tab-position="`right`"
      triggerTypeOnOverflow="more"></bs-tabs>
  </div>

  <!--<hr>
  <h3>靠下</h3>
  <div class="max-w-600">
    <bs-tabs
      tab-position="bottom"
      triggerTypeOnOverflow="more"></bs-tabs>
  </div>-->
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsTagUsage',
  components: {},

  setup (props: any) {
    let tab2 = ref('tag_5');
    return {
      tab2
    };
  }
});
</script>

<style lang="scss" scoped>
.max-w-600{
  max-width: 600px;
}
.component-usage{
  max-width: 1200px;
  min-height: 1000px;
}
</style>
