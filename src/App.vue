<template>
  <div class="app doc-app">
    <header class="doc-header">
      <nav class="navbar navbar-expand-lg navbar-light bg-primary">
        <router-link class="navbar-brand" to="/home">
          <BsiBootstrap></BsiBootstrap>
          <BsiBootstrapFill></BsiBootstrapFill>
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" aria-expanded="false"
                aria-label="Toggle navigation">
          <BsiThreeDots></BsiThreeDots>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav">
            <li class="nav-item" :class="{active: $route.path == '/' || $route.path == '/home' }">
              <router-link class="nav-link" to="/home">首页</router-link>
            </li>
            <li class="nav-item" :class="{active: $route.path == '/customized' }">
              <router-link class="nav-link" to="/customized">自定义图标</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item icon-nav-item">
              <a href="#" class="nav-link" target="_blank">
                <BsiGithub></BsiGithub>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import {
  SetupContext,
  ref,
  defineComponent,
  onMounted
} from 'vue';
import BsiThreeDots from '@/icons/BsiThreeDots';
import { BsiGithub } from '@/icons/BsiGithub';
import { BsiBootstrap } from '@/icons/BsiBootstrap';
import BsiBootstrapFill from '@/icons/BsiBootstrapFill';

export default defineComponent({
  name: 'App',
  components: {
    BsiThreeDots,
    BsiGithub,
    BsiBootstrap,
    BsiBootstrapFill
  },
  setup () {
    return {
    };
  }
});
</script>

<style lang="scss">
@import "app";
</style>
