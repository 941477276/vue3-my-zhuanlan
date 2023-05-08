<template>
  <aside class="aside-menu">
    <div class="header-search-box">
      <bs-input class="header-search-input" placeholder="搜索文档..."></bs-input>
    </div>
    <div
      class="aside-menu-container"
      :class="{
        'scroll-auto': showScroll //为了在刷新页面后能自动滚动到激活的菜单项
      }">
      <bs-menu mode="vertical" v-model:selected-keys="activeMenu">
        <bs-menu-item-group
          v-for="group in menus"
          :key="group.typeCode"
          :key-index="group.typeCode"
          :title="group.type">
          <bs-menu-item
            v-for="menu in group.children"
            :key="menu.componentName"
            :key-index="menu.componentName"
            @click="handleMenuItemClick(menu)">
            {{ menu.title }}
            <small v-if="menu.subtitle && langCode != 'en'">{{ menu.subtitle }}</small>
          </bs-menu-item>
        </bs-menu-item-group>
      </bs-menu>
    </div>
  </aside>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { langCode } from '../store/lang';
import menuZhCN from '../router/menu.zh-CN';
import menuEnUS from '../router/menu.en-US';

export default defineComponent({
  name: 'AsideMenu',
  setup () {
    let menus = computed(function () {
      let currentLang = langCode.value;
      return currentLang == 'cn' ? menuZhCN : menuEnUS;
    });
    let router = useRouter();
    let route = useRoute();
    let activeMenu = computed({
      get () {
        console.log('route.currentRoute', route);
        return [route.name];
      },
      set (newActiveMenu) {
        console.log('set newActiveMenu', newActiveMenu);
      }
    });
    let showScroll = ref(true);

    onMounted(function () {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        showScroll.value = false;
      }, 300);
    });
    return {
      menus,
      showScroll,
      activeMenu,
      langCode,
      handleMenuItemClick (menuItem) {
        router.push({ name: menuItem.componentName });
      }
    };
  }
});
</script>

<style lang="scss">
@import "aside-menu";
</style>
