<template>
  <ul
    class="bs-picker-time-panel-column">
    <li
      v-for="item in units"
      :key="item.value"
      class="bs-picker-time-panel-cell"
      :class="{
        'is-selected': item.value === value,
        'is-disabled': item.disabled
      }"
      @click="onItemClick(item)">{{ item.label }}</li>
  </ul>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent
} from 'vue';
import { TimeDataUnit } from '@/ts-tokens/bootstrap/time-picker';

export default defineComponent({
  name: 'BsTimeUnitColumn',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    units: {
      type: Array as PropType<TimeDataUnit[]>,
      default () {
        return [];
      }
    }
  },
  setup (props: any, ctx: any) {
    let onItemClick = function (item: TimeDataUnit) {
      if (item.disabled || item.value === props.value) {
        return;
      }
      ctx.attrs.onSelect?.(item);
    };
    return {
      onItemClick
    };
  }
});
</script>
