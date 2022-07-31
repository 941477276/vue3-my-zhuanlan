<template>
  <ul
    ref="ulRef"
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
  ref,
  watch,
  nextTick,
  defineComponent
} from 'vue';
import { TimeDataUnit } from '@/ts-tokens/bootstrap/time-picker';
import { util } from '@/common/util';

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
    let ulRef = ref<HTMLElement|null>(null);
    let onItemClick = function (item: TimeDataUnit) {
      if (item.disabled || item.value === props.value) {
        return;
      }
      ctx.attrs.onSelect?.(item);
    };

    watch(() => props.value, function () {
      nextTick(function () {
        let ulEl = ulRef.value;
        if (!ulEl) {
          return;
        }
        let activeLi = ulEl.querySelector('.bs-picker-time-panel-cell.is-selected') as HTMLElement;
        if (!activeLi) {
          return;
        }
        // 将选中到元素滚动置顶
        util.scrollTo(ulEl, 'y', activeLi.offsetTop, 150);
      });
    }, { immediate: true });

    return {
      ulRef,
      onItemClick
    };
  }
});
</script>
