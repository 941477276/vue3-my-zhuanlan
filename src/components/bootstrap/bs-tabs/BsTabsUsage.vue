<template>
<div class="component-usage">
 <h3>基础用法</h3>
  <div class="max-w-600">
    <bs-tabs></bs-tabs>
  </div>
  <br>
  <br>
  <div class="max-w-600" style="overflow-x: scroll;white-space: nowrap;">
    <span>aaaaaaaaaaaaaaaa</span><bs-tabs style="display: inline-block;"></bs-tabs>
  </div>
  <br>
  <br>
  <bs-tabs></bs-tabs>

  <hr>
  <h3>靠左</h3>
  <div class="max-w-600">
    <bs-tabs
      tab-position="left"
      triggerTypeOnOverflow="more"></bs-tabs>
  </div>

  <hr>
  <h3>靠右</h3>
  <div class="max-w-600">
    <bs-tabs
      :tab-position="`right`"
      triggerTypeOnOverflow="more"></bs-tabs>
  </div>

  <hr>
  <h3>靠下</h3>
  <div class="max-w-600">
    <bs-tabs
      tab-position="bottom"
      triggerTypeOnOverflow="more"></bs-tabs>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsTagUsage',
  components: {},

  setup (props: any) {
    return {
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
}
</style>
