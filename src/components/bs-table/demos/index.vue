<template>
  <div class="demo-index">
    <Basic></Basic>
    <ColAndRowSpan></ColAndRowSpan>
    <FixedHeader></FixedHeader>
    <FixedColumn></FixedColumn>
    <ExpandRow></ExpandRow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import ColAndRowSpan from './col-and-row-span.vue';
import FixedHeader from './fixed-header.vue';
import FixedColumn from './fixed-column.vue';
import ExpandRow from './expand-row.vue';

export default defineComponent({
  name: 'DemoIndex',
  components: {
    Basic,
    ColAndRowSpan,
    FixedHeader,
    FixedColumn,
    ExpandRow
  }
});
</script>
