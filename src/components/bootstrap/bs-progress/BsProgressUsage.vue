<template>
<div class="component-usage">
 <h3>基础用法</h3>
 <div>
   <bs-progress
    v-for="type in types"
    :color-type="type"
    :key="type"></bs-progress>
 </div>

  <hr>
  <h3>条纹进度条</h3>
  <div>
    <bs-progress
      color-type="primary"
      striped></bs-progress>
    <bs-progress
      color-type="success"
      striped></bs-progress>
    <bs-progress
      color-type="danger"
      striped></bs-progress>
  </div>

  <hr>
  <h3>条纹进度条</h3>
  <div>

  </div>

  <hr>
  <h3>条纹动画</h3>
  <div>
    <bs-progress
      color-type="primary"
      striped
      animated></bs-progress>
    <bs-progress
      color-type="success"
      striped
      animated></bs-progress>
    <bs-progress
      color-type="danger"
      striped
      animated></bs-progress>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsTagUsage',
  components: {},

  setup (props: any) {
    let types = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    let size = ref('');
    let tags = ref<string[]>([]);

    setTimeout(function () {
      size.value = 'small';
    }, 1500);

    let addTag = function () {
      tags.value.push(`标签_${tags.value.length}`);
    };

    return {
      types,
      size,
      tags,

      addTag
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-progress{
  margin-bottom: 1rem;
}
</style>
