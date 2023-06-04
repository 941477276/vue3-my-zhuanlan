<template>
<div
  class="bs-table"
  :class="{
    'bs-table-striped': stripe,
    'bs-table-bordered': border,
    'bs-table-borderless': borderless,
    'bs-table-sm': size == 'sm'
  }">
  <div class="bs-table-wrapper">
    <table
      class="table table-hover"
      :class="{
        'table-striped': stripe,
        'table-bordered': border,
        'table-borderless': borderless,
        'table-sm': size == 'sm'
      }">
      <!--<thead class="bs-table-head">
      <tr>
        <th>#</th>
        <th>First</th>
        <th>Last</th>
        <th>Handle</th>
      </tr>
      </thead>-->
      <BsTableHeader
        :columns="columns"
        :table-slots="$slots"></BsTableHeader>
      <tbody class="bs-table-body">
        <BsTableRow
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          :row-data="row"
          :row-index="rowIndex"
          :table-slots="$slots"
          :columns="columns">
          <!--<BsTableCell
            v-for="(column, columnIndex) in columns"
            :row-data="row"
            :row-index="rowIndex"
            :table-slots="$slots"
            :column="column"
            :cell-index="columnIndex"></BsTableCell>-->
        </BsTableRow>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, provide, reactive, Ref, SetupContext } from 'vue';
import { bsTableProps, BsTableRowSpanCellInfo, BsTableContext, bsTableCtxKey } from './bs-table-types';
import BsTableHeader from './wigets/BsTableHeader.vue';
import BsTableRow from './wigets/BsTableRow.vue';

export default defineComponent({
  name: 'BsTable',
  props: bsTableProps,
  components: {
    BsTableHeader,
    BsTableRow
  },
  setup (props: any, ctx: SetupContext) {
    // 需要合并行的单元格信息
    let rowSpanCells: Record<string, BsTableRowSpanCellInfo> = reactive({});
    let addRowSpanCell = function (rowSpanCellInfo: BsTableRowSpanCellInfo) {
      let key = rowSpanCellInfo.rowIndex + '_' + rowSpanCellInfo.cellIndex;
      // 防止重复添加
      if ((key in rowSpanCells) && rowSpanCells[key].rowSpan === rowSpanCellInfo.rowSpan) {
        return;
      }
      rowSpanCells[key] = rowSpanCellInfo;
    };
    let removeRowSpanCell = function (rowSpanCellInfo: BsTableRowSpanCellInfo) {
      let key = rowSpanCellInfo.rowIndex + '_' + rowSpanCellInfo.cellIndex;
      delete rowSpanCells[key];
    };

    provide(bsTableCtxKey, {
      rowSpanCells,
      addRowSpanCell,
      removeRowSpanCell
    });
  }
});
</script>
