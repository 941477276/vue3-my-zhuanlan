<template>
  <ul
    class="pagination bs-pagination-pager"
    :class="size ? `pagination-${size}`: ''"
    @click.stop="onPaginationClick">
    <li
      v-if="usePrev"
      class="page-item prev"
      :class="{
        disabled: currentPage == 1
      }">
      <span class="page-link">
        <slot name="prev">
          <template v-if="prevText">{{ prevText }}</template>
          <bs-icon v-else name="chevron-left"></bs-icon>
        </slot>
      </span>
    </li>
    <li
      v-show="totalPages > 0"
      class="page-item"
      :class="{
        active: currentPage == 1
      }"
      :aria-current="currentPage == 1 ? 'page' : null">
      <span class="page-link">1</span>
    </li>
    <li
      v-show="showPrevMore"
      class="page-item prev-more">
      <span class="page-link">
        <bs-icon class="three-dots" name="three-dots"></bs-icon>
        <bs-icon class="chevron-double-left" name="chevron-double-left"></bs-icon>
      </span>
    </li>
    <li
      v-for="pageNum in pagers"
      class="page-item"
      :class="{
        active: currentPage == pageNum,
        disabled: disabledPage?.includes(pageNum)
      }"
      :key="pageNum"
      :aria-current="currentPage == pageNum ? 'page' : null">
      <span class="page-link">{{ pageNum }}</span>
    </li>
    <li
      v-show="showNextMore"
      class="page-item next-more">
      <span class="page-link">
        <bs-icon class="three-dots" name="three-dots"></bs-icon>
        <bs-icon class="chevron-double-right" name="chevron-double-right"></bs-icon>
      </span>
    </li>
    <li
      v-show="totalPages > 1"
      class="page-item"
      :class="{
        active: currentPage == totalPages
      }"
      :aria-current="currentPage == totalPages ? 'page' : null">
      <span class="page-link">{{ totalPages }}</span>
    </li>
    <li
      v-if="useNext"
      class="page-item next"
      :class="{
        disabled: currentPage == totalPages
      }">
      <span class="page-link">
        <slot name="next">
          <template v-if="nextText">{{ nextText }}</template>
          <bs-icon v-else name="chevron-right"></bs-icon>
        </slot>
      </span>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  watchEffect
} from 'vue';
import { BsSize } from '@/ts-tokens/bootstrap';
import { util } from '@/common/util';
import BsIcon from '../../../bs-icon/BsIcon.vue';

export default defineComponent({
  name: 'BsPager',
  components: {
    BsIcon
  },
  props: {
    pageSize: { // 每页显示条目个数，支持v-model
      type: Number,
      default: 10
    },
    currentPage: { // 当前页码，支持v-model
      type: Number,
      default: 1
    },
    total: { // 总条目数
      type: Number,
      default: null
    },
    totalPages: { // 总页数
      type: Number,
      default: null
    },
    pagerCount: { // 页码按钮的数量，当总页数超过该值时会折叠（大于等于 5 且小于等于 21 的奇数）
      type: Number,
      default: 7
    },
    pageSizes: { // 每页显示个数选择器的选项设置
      type: Array,
      default () {
        return [10, 20, 30, 40, 50, 100];
      }
    },
    disabledPage: { // 禁用的页码
      type: Array,
      default () {
        return [];
      }
    },
    size: { // 分页器大小
      type: String as PropType<BsSize>,
      default: ''
    },
    prevText: { // 上一页按钮的文字
      type: String,
      default: ''
    },
    nextText: {
      type: String, // 下一页按钮的文字
      default: ''
    },
    usePrev: { // 是否使用上一页按钮
      type: Boolean,
      default: true
    },
    useNext: { // 是否使用下一页按钮
      type: Boolean,
      default: true
    }
  },
  emit: ['change'],
  setup (props: any, ctx: any) {
    let showPrevMore = ref(false);
    let showNextMore = ref(false);

    /*  计算页码
      这部分代码逻辑来自 element-ui-plus （https://github.com/element-plus/element-plus/blob/dev/packages/components/pagination/src/components/pager.vue）
     */
    let pagers = computed(function () {
      let pagersArr: number[] = [];

      let showPrevMore = false;
      let showNextMore = false;
      let pagerCount = props.pagerCount;
      let totalPagesVal = props.totalPages;
      let currentPage = props.currentPage;
      let halfPagerCount = (pagerCount - 1) / 2;

      if (totalPagesVal > pagerCount) {
        // 判断是否需要前后的“更多页码”按钮
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true;
        }
        if (currentPage < totalPagesVal - halfPagerCount) {
          showNextMore = true;
        }
      }
      if (showPrevMore && !showNextMore) {
        const startPage = totalPagesVal - (pagerCount - 2);
        for (let i = startPage; i < totalPagesVal; i++) {
          pagersArr.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          pagersArr.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1;
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          pagersArr.push(i);
        }
      } else {
        for (let i = 2; i < totalPagesVal; i++) {
          pagersArr.push(i);
        }
      }

      return pagersArr;
    });

    watchEffect(function () {
      const halfPagerCount = (props.pagerCount - 1) / 2;
      const totalPagesVal = props.totalPages;
      showPrevMore.value = false;
      showNextMore.value = false;
      if (totalPagesVal > props.pagerCount) {
        if (props.currentPage > props.pagerCount - halfPagerCount) {
          showPrevMore.value = true;
        }
        if (props.currentPage < totalPagesVal - halfPagerCount) {
          showNextMore.value = true;
        }
      }
    });

    let findNotDisabledPage = function (page: number, isPrev: boolean) {
      let disabledPages = props.disabledPage;
      let newPage = page;
      while (disabledPages?.includes(newPage)) {
        if (isPrev) {
          newPage--;
        } else {
          newPage++;
        }
      }
      if (newPage < 1) {
        newPage = 1;
      }
      if (newPage > props.totalPages) {
        newPage = props.totalPages;
      }
      return newPage;
    };

    let onPaginationClick = function (evt: MouseEvent) {
      let target = evt.target as HTMLElement;
      let pageNumber = Number(target.innerText);
      let pageItem;
      let pagerCountOffset = props.pagerCount - 2;
      if (util.hasClass(target, 'page-item')) {
        pageItem = target;
      } else {
        pageItem = util.parents(target, 'page-item');
      }
      // console.log('target', target, pageNumber);
      let newPage;
      let currentPage = props.currentPage;
      let isNewPageDisabled = false;
      if (util.hasClass(pageItem, 'prev')) {
        if (currentPage != 1) {
          newPage = findNotDisabledPage(currentPage - 1, true);
        }
      } else if (util.hasClass(pageItem, 'next')) {
        if (currentPage != props.totalPages) {
          newPage = findNotDisabledPage(currentPage + 1, false);
        }
      } else if (util.hasClass(pageItem, 'prev-more')) {
        newPage = currentPage - pagerCountOffset;
        newPage = findNotDisabledPage(newPage <= 0 ? 1 : newPage, true);
      } else if (util.hasClass(pageItem, 'next-more')) {
        newPage = findNotDisabledPage(currentPage + pagerCountOffset, false);
      } else {
        newPage = isNaN(pageNumber) ? 1 : pageNumber;
        isNewPageDisabled = props.disabledPage?.includes(newPage);
      }
      // console.log('newPage', newPage);
      if (newPage && newPage !== currentPage && !isNewPageDisabled) {
        ctx.emit('change', newPage);
      }
    };

    return {
      pagers,
      showPrevMore,
      showNextMore,

      onPaginationClick
    };
  }
});
</script>
