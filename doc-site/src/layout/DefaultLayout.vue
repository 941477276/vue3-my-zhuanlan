<template>
<div class="default-layout header-fixed">
  <Header></Header>
  <div class="main-container">
    <aside class="aside-menu">
      <h2>侧边菜单栏</h2>
    </aside>
    <main class="doc-main">
      <router-view></router-view>
    </main>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import Header from './Header.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    Header
  }
});
</script>

<style lang="scss">
.default-layout{
  &.header-fixed{
    padding-top: 4rem; // 60px
    .doc-header{
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
    }
  }
  .main-container{
    display: flex;
    min-height: calc(100vh - 4rem);
  }
  .aside-menu{
    width: 300px;
    flex: 0 0 300px;
    border-right: 1px solid #eee;
  }
  .doc-main{
    flex: 1;
    padding: 40px;
  }
}
</style>
