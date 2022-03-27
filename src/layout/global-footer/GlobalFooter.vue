<template>
<footer class="global-footer">
  <div class="container-fluid">
    <p class="copyright">@ 2022 我的专栏</p>
  </div>
</footer>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'GlobalFooter'
});
</script>

<style lang="scss">
.global-footer{
  background-color: #f7f7f7;
  .copyright{
    padding: .8rem 0;
    text-align: center;
  }
}
</style>
