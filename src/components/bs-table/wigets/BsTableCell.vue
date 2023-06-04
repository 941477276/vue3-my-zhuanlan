<template>
  <td
    v-bind="cellAttrs"
    class="bs-table-cell"
    :class="cellClasses">
    <div class="bs-table-cell-content">
      <BsTableCellContent
        :row-index="rowIndex"
        :cell-index="cellIndex"
        :row-data="rowData"
        :label="cellContent"
        :table-slots="tableSlots"
        :slot-name="column.prop"></BsTableCellContent>
    </div>
  </td>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { BsTableCellContent } from './BsTableCellContent';
import { BsTableColumn } from '../bs-table-types';
import { isFunction } from '@vue/shared';

export default defineComponent({
  name: 'BsTableCell',
  components: {
    BsTableCellContent
  },
  props: {
    rowData: {
      type: Object,
      default () {
        return {};
      }
    },
    rowIndex: {
      type: Number
    },
    cellIndex: {
      type: Number
    },
    tableSlots: {
      type: Object
    },
    column: { // 当前列配置
      type: Object as PropType<BsTableColumn>,
      default () {
        return {};
      }
    },
    cellAttrs: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  setup (props: any) {
    let cellContent = computed(function () {
      let customCell = props.column.customCell;
      if (isFunction(customCell)) {
        return customCell;
      }
      return props.rowData[props.column.prop];
    });
    // 单元格class
    let cellClasses = computed(function () {
      let customCellClass = props.column.customCellClass;
      if (isFunction(customCellClass)) {
        customCellClass = customCellClass(props.rowData, props.cellIndex, props.column);
      }
      if (customCellClass) {
        return customCellClass;
      }
      return '';
    });
    return {
      cellContent,
      cellClasses
    };
  }
});
</script>
