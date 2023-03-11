<template>
  <header class="doc-header">
    <nav class="navbar navbar-expand-lg bg-primary">
      <transition name="brand-slide">
        <router-link v-show="navbarBrandVisible" class="navbar-brand" to="/index">
          <BsiBootstrap></BsiBootstrap>
          <BsiBootstrapFill></BsiBootstrapFill>
          <span class="brand-text">
           Bootstrap <i>Vue<small>3</small></i>
        </span>
        </router-link>
      </transition>

      <bs-button class="navbar-toggler" aria-label="Toggle navigation" @click="$emit('navbar-toggler-click')">
        <BsiThreeDots></BsiThreeDots>
      </bs-button>

      <div class="navbar-container" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item" :class="{active: $route.path == '/' || $route.path == '/index' }">
            <router-link class="nav-link" to="/home">文档</router-link>
          </li>
          <li class="nav-item" :class="{active: $route.path.startsWith('/component') }">
            <router-link class="nav-link" to="/component">组件</router-link>
          </li>
          <li class="nav-item lang-nav-item">
            <bs-dropdown placement="bottom-end" >
              <bs-button>中文</bs-button>
              <template #content>
                <bs-dropdown-item active>中文</bs-dropdown-item>
                <bs-dropdown-item>English</bs-dropdown-item>
              </template>
            </bs-dropdown>
          </li>
          <li class="nav-item version-nav-item">
            <bs-dropdown placement="bottom-end">
              <bs-button>1.0.0</bs-button>
              <template #content>
                <bs-dropdown-item>中文</bs-dropdown-item>
                <bs-dropdown-item>English</bs-dropdown-item>
              </template>
            </bs-dropdown>
          </li>
          <li class="nav-item icon-nav-item">
            <a href="https://github.com/941477276/vue3-bootstrap-icon" class="nav-link lib-github-link" title="Code github" target="_blank">
              <BsiGithub></BsiGithub>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onBeforeUnmount
} from 'vue';
import { BsiGithub } from 'vue3-bootstrap-icon/es/icons/BsiGithub';
import { BsiBootstrap } from 'vue3-bootstrap-icon/es/icons/BsiBootstrap';
import { BsiBootstrapFill } from 'vue3-bootstrap-icon/es/icons/BsiBootstrapFill';
import { BsiThreeDots } from "vue3-bootstrap-icon/es/icons/BsiThreeDots";

export default defineComponent({
  name: 'Header',
  emits: ['navbar-toggler-click'],
  components: {
    BsiGithub,
    BsiBootstrap,
    BsiBootstrapFill,
    BsiThreeDots
  },
  setup () {
    let navbarBrandVisible = ref(true);
    let matchMedia576 = matchMedia('(max-width: 576px)');
    // 屏幕宽度小于576px的处理函数
    let handleScreenWidthLess576 = function (evt: MediaQueryListEvent) {
      console.log('handleScreenWidthLess576', evt);
      if (evt.matches) {
        navbarBrandVisible.value = false;
      } else {
        navbarBrandVisible.value = true;
      }
    };
    console.log('matchMedia576', matchMedia576);
    matchMedia576.addEventListener('change', handleScreenWidthLess576);
    onBeforeUnmount(function () {
      matchMedia576.removeEventListener('change', handleScreenWidthLess576);
    });
    return {
      navbarBrandVisible
    };
  }
});
</script>

<style lang="scss">
@import "header";
</style>
