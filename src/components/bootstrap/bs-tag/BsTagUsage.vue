<template>
<div class="component-usage">
 <h3>基础用法</h3>
  <div>
    <bs-tag
      v-for="typeName in types"
      :key="typeName"
      :type="typeName">{{ typeName }}</bs-tag>
  </div>

  <hr>
  <h3>不同大小</h3>
  <div>
    <bs-tag>默认大小</bs-tag>
    <bs-tag size="md">中等大小</bs-tag>
    <bs-tag size="sm">小的</bs-tag>
    <bs-tag size="mini">超级小的</bs-tag>
    <bs-tag type="success" :size="size">动态变化</bs-tag>
  </div>

  <hr>
  <h3>dark主题</h3>
  <div>
    <bs-tag
      v-for="typeName in types"
      :key="typeName"
      :type="typeName"
      effect="dark">{{ typeName }}</bs-tag>
  </div>

  <hr>
  <h3>朴素主题</h3>
  <div>
    <bs-tag
      v-for="typeName in types"
      :key="typeName"
      :type="typeName"
      effect="plain">{{ typeName }}</bs-tag>
  </div>

  <hr>
  <h3>可关闭</h3>
  <div>
    <bs-tag
      v-for="typeName in types"
      :key="typeName"
      :type="typeName"
      :closeable="true">{{ typeName }}</bs-tag>
  </div>

  <hr>
  <h3>可关闭，不同大小</h3>
  <div>
    <bs-tag :closeable="true">默认大小</bs-tag>
    <bs-tag size="md" :closeable="true">中等大小</bs-tag>
    <bs-tag size="sm" :closeable="true">小的</bs-tag>
    <bs-tag size="mini" :closeable="true">超级小的</bs-tag>
    <bs-tag type="success" :size="size" :closeable="true">动态变化</bs-tag>
  </div>

  <hr>
  <h3>动态添加</h3>
  <div>
    <bs-tag
      v-for="(item, index) in tags"
      :key="index"
      :closeable="true">{{ item }}</bs-tag>
    <bs-button type="primary" @click="addTag">添加标签</bs-button>
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsTagUsage',
  components: {},

  setup (props: any) {
    let types = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'];
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
.bs-tag{
  margin-right: 10px;
}
</style>
