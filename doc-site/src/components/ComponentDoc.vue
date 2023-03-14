<template>
<article class="component-doc">
  <h1 class="component-name">{{ apiDoc.title }} <small v-if="apiDoc.subtitle">{{ apiDoc.subtitle }}</small></h1>
  <div class="component-description" v-html="apiDoc.description"></div>
  <div class="code-demonstration-container">
    <h2>代码演示</h2>
    <slot></slot>
  </div>
  <div class="api-container" v-html="apiDoc.apiContent">
  </div>
</article>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref
} from 'vue';

export default defineComponent({
  name: 'ComponentDoc',
  props: {
    componentName: { // 组件名称
      type: String,
      default: ''
    }
  },
  setup (props: any) {
    let apiDoc = ref({});
    import(/* webpackChunkName: "apiDoc-[request]" */ `../apiDocs/${props.componentName}/zh-CN.json`)
      .then(res => {
        console.log('apiDoc', res.default);
        apiDoc.value = res.default;
      });
    return {
      apiDoc
    };
  }
});
</script>

<style lang="scss">

</style>
