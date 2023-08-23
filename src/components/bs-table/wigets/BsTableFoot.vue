<template>
  <tfoot class="bs-table-foot">
    <tr
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="bs-table-foot-row"
      v-bind="row.attrs">
      <td
        class="bs-table-cell bs-table-foot-cell"
        v-for="(cell, index) in row.columns"
        :key="index"
        v-bind="cell.attrs">
        <BsTableCellContent
          :row-index="rowIndex"
          :cell-index="index as number"
          :label="cell.label"
          :row-data="row.tableDataRaw"
          :table-slots="tableSlots"
          :default-content="$slots.default"
          :slot-name="cell.slotName">
        </BsTableCellContent>
      </td>
      <!--<BsTableCell
        v-for="(cell, index) in row"
        :row-index="rowIndex"
        :row-id="rowIndex"
        :table-slots="tableSlots"
        :cell-index="index"
        :column="cell.column"
        :row-data="cell.data"
        :key="`cell_${rowIndex}_${index}`"
        :cell-attrs="cell.attrs"
        :slot-name="cell.slotName"></BsTableCell>-->
    </tr>
  </tfoot>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, SetupContext
} from 'vue';
import {
  BsColgroupItem,
  BsTableColumn,
  BsTableFootColumn, BsTableFootRow, BsTableRowData,
  BsTableSize
} from '../bs-table-types';
import { isFunction } from '@vue/shared';
import BsTableCellContent from './BsTableCellContent';
import BsTableCell from './BsTableCell.vue';

export default defineComponent({
  name: 'BsTableFoot',
  components: {
    BsTableCellContent,
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
    tableData: { // 表格数据
      type: Array as PropType<BsTableRowData[]>,
      default () {
        return [];
      }
    },
    footerRows: { // 表格尾部行
      type: Array as PropType<BsTableFootRow[]>
    },
    footerMethod: { // 高度自定义表格尾部列函数
      type: Function as PropType<(tableData: Record<string, any>[], columns: BsTableColumn[]) => BsTableFootRow[]>
    }
  },
  setup (props: any, ctx: SetupContext) {
    let rows = computed(function () {
      let { footerRows, footerMethod, columns, tableData } = props;
      let tableDataRaw = tableData!.map((row: BsTableRowData) => row.node);
      if (isFunction(footerMethod)) {
        let footerRow1 = footerMethod(tableDataRaw, columns);
        if (Array.isArray(footerRow1) && footerRow1.length > 0) {
          footerRows = footerRow1;
        }
      }
      if (!Array.isArray(footerRows)) {
        return [];
      }
      let rows = footerRows.map((row, index) => {
        let newRow: { attrs?: Record<string, any>; columns: Record<string, any>[]; tableDataRaw: Record<string, any>[] } = {
          columns: [],
          tableDataRaw
        };
        newRow.columns = row.columns.map((column: BsTableFootColumn, columnIndex: number) => {
          let { label, cellAttrs, slotName } = column;
          let newLabel = label;
          if (isFunction(label)) {
            // @ts-ignore
            newLabel = () => label(tableDataRaw, index, columns);
          }
          let attrs = cellAttrs;
          if (isFunction(cellAttrs)) {
            attrs = cellAttrs(tableDataRaw, index, columns);
          }
          /* let columnItem = {
            ...columns[columnIndex],
            prop: 'label'
          }; */
          return {
            // column: columnItem,
            label: newLabel,
            /* data: {
              label: newLabel
            }, */
            attrs,
            slotName
          };
        });
        return newRow;
      });
      return rows;
    });

    return {
      rows
    };
  }
});
</script>
