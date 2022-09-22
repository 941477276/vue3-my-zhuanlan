<!--<template>
  <div
    class="bs-pagination"
    :class="size ? `bs-pagination-${size}` : ''">
    <Total
      :total="total"
      :total-page="totalPages"></Total>
    <Sizes
      :size="size"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @change="changePageSize"></Sizes>
    <BsPager
      v-bind="$props"
      :total-pages="totalPages"
      :size="size"
      @change="changeCurrentPage"></BsPager>
    <Jumper
      :size="size"
      :total-pages="totalPages"
      @change="changeCurrentPage"></Jumper>
  </div>
</template>-->

<script lang="ts">
import {
  h,
  computed,
  defineComponent,
  PropType,
  VNode
} from 'vue';
import {
  BsSize
} from '@/ts-tokens/bootstrap';
import BsPager from './widgets/bs-pager/BsPager.vue';
import Total from './widgets/total/Total.vue';
import Sizes from './widgets/sizes/Sizes.vue';
import Jumper from './widgets/jumper/Jumper.vue';

type LayoutKey = 'pager' | 'sizes' | 'total' | 'jumper' | 'slot';

export default defineComponent({
  name: 'BsPagination',
  components: {
    BsPager,
    Total,
    Sizes,
    Jumper
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
    size: { // 分页器大小
      type: String as PropType<BsSize>,
      default: ''
    },
    layout: { // 组件布局，子组件名用逗号分隔
      type: [String, Array],
      default: 'total,pager,sizes,jumper,slot'
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
    },
    hideOnSinglePage: { // 只有一页时是否隐藏
      type: Boolean,
      default: false
    }
  },
  emits: ['update:currentPage', 'update:pageSize', 'sizeChange', 'currentChange'],
  setup (props: any, ctx: any) {
    // 总页数
    let totalPages = computed(function () {
      let total = props.total;
      let pageSize = props.pageSize;
      if (!total || !pageSize || total < 1 || pageSize < 1) {
        return 0;
      }
      return Math.ceil(total / pageSize);
    });
    // 处理当前页码变化
    let changeCurrentPage = function (currentPage: number) {
      // console.log('currentPage', currentPage);
      if (typeof currentPage !== 'object' && currentPage !== props.currentPage) {
        ctx.emit('update:currentPage', currentPage);
        ctx.emit('currentChange', currentPage);
      }
    };
    // 处理每页显示条目个数变化
    let changePageSize = function (pageSize: number) {
      if (pageSize != props.pageSize) {
        ctx.emit('update:pageSize', pageSize);
        ctx.emit('sizeChange', pageSize);
      }
    };

    return () => {
      let size = props.size;
      let slotDefault = ctx.slots.default;
      let layoutMap: Record<LayoutKey, VNode | VNode[] | null> = {
        total: h(Total, {
          totalPage: totalPages.value,
          total: props.total
        }),
        pager: h(BsPager, {
          ...props,
          'total-pages': totalPages.value,
          size,
          onChange: changeCurrentPage
        }),
        sizes: h(Sizes, {
          size,
          'page-size': props.pageSize,
          'page-sizes': props.pageSizes,
          onChange: changePageSize
        }),
        jumper: h(Jumper, {
          size,
          'current-page': props.currentPage,
          'total-pages': totalPages.value,
          onChange: changeCurrentPage
        }),
        slot: slotDefault ? slotDefault() : null
      };
      let layoutArr = Array.isArray(props.layout) ? props.layout : props.layout?.split(',');
      let children: Array<VNode | VNode[] | null> = (layoutArr || []).map((item: LayoutKey) => {
        (item as string) = item.trim();
        return layoutMap[item];
      });

      /* eslint-disable */
      return h('div', {
        'class': [
          'bs-pagination',
          size ? `bs-pagination-${size}` : ''
        ],
        style: {
          display: (props.hideOnSinglePage && totalPages.value <= 1) ? 'none' : ''
        }
      }, children);
    }
  }
});
</script>

<style lang="scss">
@import "bs-pagination";
</style>
