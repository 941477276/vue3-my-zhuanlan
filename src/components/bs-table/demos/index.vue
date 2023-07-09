<template>
  <div class="demo-index">
    <Basic></Basic>
    <ColAndRowSpan></ColAndRowSpan>
    <FixedHeader></FixedHeader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import ColAndRowSpan from './col-and-row-span.vue';
import FixedHeader from './fixed-header.vue';

export default defineComponent({
  name: 'DemoIndex',
  components: {
    Basic,
    ColAndRowSpan,
    FixedHeader
  }
});
</script>
