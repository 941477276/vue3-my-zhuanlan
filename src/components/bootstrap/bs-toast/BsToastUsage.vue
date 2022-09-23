<template>
<div class="component-usage">
  <div>
    <BsToast type="success">
      <template #header>
        <!--<img width="20px" height="20px" src="https://p3-sign.bdxiguaimg.com/tos-cn-i-0004/18afff332d8b42b1b187d886d9c23c7c~tplv-pk90l89vgd-crop-center:864:486.avif?x-expires=1695471878&x-signature=51kjbHfGg1EUycVbib7pmMxwppI%3D" class="rounded mr-2" alt="...">-->
        <strong class="mr-auto">Bootstrap!</strong>
        <small>11 mins ago</small>
      </template>
      轻提示内容
    </BsToast>
    <BsToast type="danger">
      <template #header>
        <!--<img width="20px" height="20px" src="https://p3-sign.bdxiguaimg.com/tos-cn-i-0004/18afff332d8b42b1b187d886d9c23c7c~tplv-pk90l89vgd-crop-center:864:486.avif?x-expires=1695471878&x-signature=51kjbHfGg1EUycVbib7pmMxwppI%3D" class="rounded mr-2" alt="...">-->
        <strong class="mr-auto">Bootstrap!</strong>
        <small>11 mins ago</small>
      </template>
      轻提示内容
    </BsToast>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsToast from './BsToast.vue';

export default defineComponent({
  name: 'BsToastUsage',
  components: {
    BsToast
  }
});
</script>

<style lang="scss" scoped>

</style>
