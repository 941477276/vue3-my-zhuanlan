<template>
  <tfoot class="bs-table-foot">

  </tfoot>
</template>

<script lang="ts">
import {
  AppContext, computed,
  defineComponent, PropType, SetupContext
} from 'vue';
import BsTableCell from './BsTableCell.vue';
import {
  BsColgroupItem,
  BsTableColumn,
  BsTableFootColumn,
  BsTableSize
} from '../bs-table-types';
import { isFunction } from '@vue/shared';

export default defineComponent({
  name: 'BsTableFoot',
  components: {
    BsTableCell
  },
  props: {
    width: [String, Number],
    colgroup: {
      type: Array as PropType<BsColgroupItem[]>,
      default () {
        return [];
      }
    },
    size: {
      type: String as PropType<BsTableSize>
    },
    columns: { // 表格列
      type: Array as PropType<BsTableColumn[]>,
      default () {
        return [];
      }
    },
    tableSlots: {
      type: Object
    },
    tableBodyHasScroll: {
      type: Boolean,
      default: false
    },
    tableBodyScrollWidth: {
      type: Number,
      default: 0
    },
    tableWidth: { // 表格宽度
      type: Number,
      default: 0
    },
    footerColumns: { // 表格尾部列
      type: Array as PropType<BsTableFootColumn[][]>
    },
    footerMethod: { // 高度自定义表格尾部列函数
      type: Function as PropType<(tableData: Record<string, any>[], columns: BsTableColumn[]) => BsTableFootColumn[][]>
    }
  },
  setup (props: any, ctx: SetupContext) {
    let cells = computed(function () {
      let { footerColumns, footerMethod } = props;
      if (isFunction(footerMethod)) {

      }
    });
  }
});
</script>
