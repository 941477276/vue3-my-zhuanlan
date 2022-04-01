<template>
  <div class="bs-pagination-jumper" :class="size ? `bs-pagination-jumper-${size}` : ''">
    前往
    <bs-input
      type="number"
      :size="size"
      v-model="page"
      @blur="changeCurrentPage"
      @keyup.enter.stop="changeCurrentPage"
      @change="onInputChange"></bs-input>
    页
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType
} from 'vue';
import { BsSize } from '@/ts-tokens/bootstrap';
import BsInput from '../../../bs-input/BsInput.vue';

export default defineComponent({
  name: 'Jumper',
  components: {
    BsInput
  },
  props: {
    currentPage: { // 当前页码，支持v-model
      type: Number,
      default: 1
    },
    size: {
      type: String as PropType<BsSize>,
      default: ''
    },
    pageSize: { // 每页显示条目个数，支持v-model
      type: Number,
      default: 10
    },
    pageSizes: { // 每页显示个数选择器的选项设置
      type: Array,
      default () {
        return [10, 20, 30, 40, 50, 100];
      }
    },
    totalPages: {
      type: Number,
      default: 0
    }
  },
  emit: ['change'],
  setup (props: any, ctx: any) {
    let jumperPage = 0;
    let page = computed({
      get () {
        return props.currentPage;
      },
      set (newVal: string) {
        let pageNum = Math.floor(Math.abs((newVal as any) * 1));
        if (pageNum > props.totalPages) {
          pageNum = props.totalPages;
        } else if (pageNum <= 0) {
          pageNum = 1;
        }
        jumperPage = pageNum;
      }
    });

    let changeCurrentPage = function () {
      let pageNum = jumperPage || props.currentPage;
      if (pageNum > props.totalPages) {
        pageNum = props.totalPages;
      }
      if (pageNum != props.currentPage) {
        ctx.emit('change', pageNum);
      }
    };
    let onInputChange = function () {
      console.log('input change');
    };
    return {
      page,
      changeCurrentPage,
      onInputChange
    };
  }
});
</script>

<style lang="scss">
.bs-pagination-jumper{
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  margin-right: 0.75rem;
  .bs-input{
    //display: inline-flex;
    //vertical-align: middle;
    width: 3.25rem; // 52px
    margin: 0 0.35rem;
  }
  .form-control{
    text-align: center;
  }
  .bs-input.input-group-lg{
    width: 4.6875rem; // 75px
    .form-control:not(textarea){
      height: calc(1.5em + 1.5rem + 2px);
      font-size: 1.25rem;
    }
  }
}
.bs-pagination-jumper-lg{
  .bs-input{
    margin: 0 0.85rem;
  }
}
</style>
