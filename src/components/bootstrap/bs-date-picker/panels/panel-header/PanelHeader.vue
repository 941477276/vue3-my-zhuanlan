<template>
  <div class="bs-picker-header">
    <button type="button" tabindex="-1" class="bs-picker-header-super-prev-btn">
      <BsIcon name="chevron-double-left"></BsIcon>
    </button>
    <button type="button" tabindex="-1" class="bs-picker-header-prev-btn">
      <BsIcon name="chevron-left"></BsIcon>
    </button>
    <div class="bs-picker-header-content">
      <slot>
        <button type="button" tabindex="-1" class="bs-picker-header-year-btn">2022年</button>
        <button type="button" tabindex="-1" class="bs-picker-header-month-btn">08月</button>
      </slot>
    </div>
    <button type="button" tabindex="-1" class="bs-picker-header-next-btn">
      <BsIcon name="chevron-right"></BsIcon>
    </button>
    <button type="button" tabindex="-1" class="bs-picker-header-super-next-btn">
      <BsIcon name="chevron-double-right"></BsIcon>
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';

export default defineComponent({
  name: 'PanelHeader',
  components: {
    BsIcon
  }
});
</script>

<style lang="scss">
@import "panel-header";
</style>
