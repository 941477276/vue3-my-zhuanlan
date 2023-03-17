<template>
<article class="component-doc">
  <h1 class="component-name">{{ apiDoc.title }} <small v-if="apiDoc.subtitle">{{ apiDoc.subtitle }}</small></h1>
  <div class="component-description" v-html="apiDoc.description"></div>
  <div class="code-demonstration-container">
    <h2 class="code-demonstration-h2">代码演示</h2>
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
.component-doc{
  .component-name{
    margin-bottom: 0.75rem;
  }
  .component-description{
    font-size: 0.875rem;
  }
  .code-demonstration-container{
    margin-top: 2rem;
  }
  .api-container{
    margin-top: 3rem;
    h3{
      margin-bottom: 1rem;
    }
  }
  .code-demonstration-h2,
  .api-h2{
    margin-bottom: 1.5rem;
  }
  .api-table{
    border: 1px solid #dee2e6;
    margin-bottom: 2.5rem;
    th{
      white-space: nowrap;
    }
    td{
      word-break: break-all;
      word-wrap: break-word;
      &:first-child{
        white-space: nowrap;
      }
      &:nth-child(2) {
        min-width: 200px;
      }
      &:nth-child(3){
        min-width: 140px;
      }
    }
  }
}
</style>
