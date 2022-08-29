<template>
  <ul
    ref="ulRef"
    class="bs-picker-time-panel-column">
    <li
      v-for="item in units"
      v-show="!(item.disabled && hideDisabledOptions)"
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
  onMounted,
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
    },
    parentVisible: { // 父组件是否可见
      type: Boolean,
      default: true
    },
    hideDisabledOptions: { // 是否隐藏禁用的选项
      type: Boolean,
      default: false
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

    // 将选中到元素滚动置顶
    let scroll2Top = function (duration = 0) {
      nextTick(function () {
        let ulEl = ulRef.value;
        if (!ulEl) {
          return;
        }
        let activeLi = ulEl.querySelector('.bs-picker-time-panel-cell.is-selected') as HTMLElement;
        if (!activeLi) {
          return;
        }
        // @ts-ignore
        util.scrollTo(ulEl, 'y', activeLi.offsetTop, duration);
      });
    };

    watch(() => props.value, function () {
      if (!props.parentVisible) {
        return;
      }
      scroll2Top(150);
    }, { immediate: true });
    watch(() => props.parentVisible, function (isVisible: boolean) {
      if (isVisible) {
        // 需要等dom元素可见后再进行滚动
        let timer = setTimeout(function () {
          clearTimeout(timer);
          scroll2Top(0);
        }, 60);
      }
    }, { immediate: true });

    return {
      ulRef,
      onItemClick
    };
  }
});
</script>
