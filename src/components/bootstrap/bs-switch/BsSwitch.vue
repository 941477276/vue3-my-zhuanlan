<template>
<div class="bs-switch">
  <input type="checkbox" class="bs-switch-hidden-input" />
  <div class="bs-switch-inner">
    <span class="bs-switch-text">开</span>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsSwitch'
});
</script>

<style lang="scss">
@import "bs-switch";
</style>
