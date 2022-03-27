<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">我的专栏</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="account-link" to="/login">登陆</router-link>
          </li>
          <li class="nav-item">
            <router-link class="account-link" to="/regist">注册</router-link>
          </li>
          <li class="nav-item">
            <bs-dropdown>
              <bs-button type="info">欢迎你，xxx</bs-button>
              <template #dropdown-item>
                <bs-dropdown-item>新建文章</bs-dropdown-item>
                <bs-dropdown-item>管理账户</bs-dropdown-item>
              </template>
            </bs-dropdown>
          </li>
        </ul>
      </div>
    </div>

  </nav>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'GlobalHeader',
  components: {}

});
</script>

<style lang="scss">
.nav-item{
  & + .nav-item {
    margin-left: 0.9rem;
  }
  .account-link{
    display: inline-block;
    vertical-align: middle;
    padding: .35rem .9rem;
    border: 1px solid #fff;
    border-radius: 0.3rem;
    color: #fff;
    text-decoration: none;
    transition: all .2s;
    &:hover{
      border-color: #28a745;
      color: #28a745;
    }
  }
}
</style>
