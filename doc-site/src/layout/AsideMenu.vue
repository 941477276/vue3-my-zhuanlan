<template>
  <aside class="aside-menu">
    <div class="header-search-box">
      <bs-input class="header-search-input" placeholder="搜索文档..."></bs-input>
    </div>
    <div class="aside-menu-container">
      <bs-menu mode="vertical" v-model:selected-keys="activeMenu">
        <bs-menu-item-group
          v-for="group in menus"
          :key="group.type"
          :key-index="group.type"
          :title="group.type">
          <bs-menu-item
            v-for="menu in group.children"
            :key="menu.componentName"
            :key-index="menu.componentName"
            @click="handleMenuItemClick(menu)">
            {{ menu.title }}
            <small v-if="menu.subtitle">{{ menu.subtitle }}</small>
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
  computed
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import menuZhCN from '../router/menu.zh-CN';

export default defineComponent({
  name: 'AsideMenu',
  setup () {
    let menus = ref(menuZhCN);
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

    return {
      menus,
      activeMenu,
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
