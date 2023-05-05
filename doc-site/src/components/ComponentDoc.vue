<template>
<article class="component-doc" ref="componentDocRef">
  <h1 class="component-name">{{ apiDoc.title }} <small v-if="apiDoc.subtitle">{{ apiDoc.subtitle }}</small></h1>
  <div class="component-description" v-html="apiDoc.description"></div>
  <div class="code-demonstration-container" ref="codeDemoContainerRef">
    <h2 class="code-demonstration-h2">代码演示</h2>
    <slot></slot>
  </div>
  <div class="api-container" v-html="apiDoc.apiContent">
  </div>
  <nav class="anchor-nav">
    <ul>
      <li
        v-for="menu in anchorMenuList"
        :key="menu.id"
        @click="handleAnchorMenuItemClick(menu)">{{ menu.title }}</li>
    </ul>
    <!--<span class="anchor-nav-active-dot"></span>-->
  </nav>
</article>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref, onMounted
} from 'vue';
import { scrollIntoParentView } from '../../../src/utils/bs-util';

interface AnchorMenuItem {
  id: string;
  title: string;
}
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
    // 动态加载文档内容
    import(/* webpackChunkName: "apiDoc-[request]" */ `../apiDocs/${props.componentName}/zh-CN.json`)
      .then(res => {
        console.log('apiDoc', res.default);
        apiDoc.value = res.default;
      });

    let codeDemoContainerRef = ref<HTMLElement|null>(null);
    // 右侧锚导航列表
    let anchorMenuList = ref<AnchorMenuItem[]>([]);
    let findAnchorMenu = function () {
      let codeDemoContainerEl = codeDemoContainerRef.value;
      if (!codeDemoContainerEl) {
        return;
      }
      let menuList: AnchorMenuItem[] = [...codeDemoContainerEl.querySelectorAll('.demo-box')].map(demoBoxEl => {
        let id = demoBoxEl.id;
        let title = demoBoxEl.querySelector('.demo-title').innerText || '';
        return {
          id,
          title
        };
      });
      menuList.push({ id: 'API_h2', title: 'API' });
      anchorMenuList.value = menuList;
      console.log('anchorMenuList', menuList);
    };

    let componentDocRef = ref();
    let handleAnchorMenuItemClick = function (menuItem: AnchorMenuItem) {
      let demoBoxEl = componentDocRef.value.querySelector('#' + menuItem.id);
      let docHeaderHeight = document.getElementById('docHeader').offsetHeight;
      scrollIntoParentView(demoBoxEl, { top: docHeaderHeight + 20 });
    };

    onMounted(findAnchorMenu);
    return {
      codeDemoContainerRef,
      apiDoc,
      componentDocRef,
      anchorMenuList,

      handleAnchorMenuItemClick
    };
  }
});
</script>

<style lang="scss">
@import "component-doc";
</style>
