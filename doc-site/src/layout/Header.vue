<template>
  <header class="doc-header">
    <nav class="navbar navbar-expand-lg bg-primary">
      <router-link class="navbar-brand" to="/index">
        <BsiBootstrap></BsiBootstrap>
        <BsiBootstrapFill></BsiBootstrapFill>
      </router-link>
      <!--<button class="navbar-toggler" type="button" data-toggle="collapse" aria-expanded="false"
              aria-label="Toggle navigation">
        <BsiThreeDots></BsiThreeDots>
      </button>-->

      <div class="navbar-container" id="navbarSupportedContent">

        <ul class="navbar-nav">
          <li class="nav-item" :class="{active: $route.path == '/' || $route.path == '/index' }">
            <router-link class="nav-link" to="/home">首页</router-link>
          </li>
          <li class="nav-item" :class="{active: $route.path == '/customized' }">
            <router-link class="nav-link" to="/customized">自定义图标</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
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
  defineComponent
} from 'vue';
import { BsiGithub } from 'vue3-bootstrap-icon/es/icons/BsiGithub';
import { BsiBootstrap } from 'vue3-bootstrap-icon/es/icons/BsiBootstrap';
import { BsiBootstrapFill } from 'vue3-bootstrap-icon/es/icons/BsiBootstrapFill';

export default defineComponent({
  name: 'Header',
  components: {
    BsiGithub,
    BsiBootstrap,
    BsiBootstrapFill
  }
});
</script>

<style lang="scss">
@import "header";
</style>
