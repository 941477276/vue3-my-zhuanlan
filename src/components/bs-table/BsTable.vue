<template>
<div
  ref="tableContainerRef"
  class="bs-table"
  :class="{
    'table-striped': stripe,
    'table-bordered': border,
    'table-borderless': borderless,
    'bs-table-sm': size == 'sm'
  }">
  <div class="bs-table-wrapper">
    <table
      ref="tableRef"
      class="table table-hover"
      :class="{
        'table-sm': size == 'sm'
      }"
      :style="{
        width: tableWidth > 0 ? (tableWidth + 'px') : ''
      }">
      <colgroup v-if="colgroup.length > 0">
        <col
          v-for="(item, index) in colgroup"
          :key="index"
          :style="{
            width: item.width + 'px'
          }"/>
      </colgroup>
      <BsTableHead
        :columns="columns"
        :table-slots="$slots"></BsTableHead>
      <tbody class="bs-table-body">
        <BsTableRow
          v-for="(row, rowIndex) in realTableData"
          :key="getRowKey(row, rowIndex)"
          :row-data="row.data"
          :row-index="rowIndex"
          :table-slots="$slots"
          :columns="columns"
          :row-class-name="rowClassName">
        </BsTableRow>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, provide, reactive, ref, Ref, SetupContext, watch } from 'vue';
import { bsTableProps, BsTableRowSpanCellInfo, BsTableContext, bsTableCtxKey, BsTableColumn } from './bs-table-types';
import BsTableHead from './wigets/BsTableHead.vue';
import BsTableRow from './wigets/BsTableRow.vue';
import { isFunction } from '@vue/shared';
import { getStyle } from '../../utils/bs-util';

interface ColSpanCellInfo {
  colSpan: number; // 合并列数
  cellIndex: number; // 需要合并的列的索引
}

export default defineComponent({
  name: 'BsTable',
  props: bsTableProps,
  components: {
    BsTableHead,
    BsTableRow
  },
  setup (props: any, ctx: SetupContext) {
    // 需要合并行的单元格信息
    let rowSpanCells: Record<string, BsTableRowSpanCellInfo> = reactive({});
    let addRowSpanCell = function (rowSpanCellInfo: BsTableRowSpanCellInfo) {
      let key = rowSpanCellInfo.rowIndex + '_' + rowSpanCellInfo.cellIndex;
      console.log('增加了：', key);
      // 防止重复添加
      if ((key in rowSpanCells) && rowSpanCells[key].rowSpan === rowSpanCellInfo.rowSpan) {
        return;
      }
      rowSpanCells[key] = rowSpanCellInfo;
    };
    let removeRowSpanCell = function (rowSpanCellInfo: BsTableRowSpanCellInfo, removeCurrentRowCells?: boolean) {
      let rowIndex = rowSpanCellInfo.rowIndex;
      let key = rowIndex + '_' + rowSpanCellInfo.cellIndex;
      if (key in rowSpanCells) {
        delete rowSpanCells[key];
        return;
      }
      if (!removeCurrentRowCells) {
        return;
      }
      let rowIndexStr = rowIndex + '';
      for (let attr in rowSpanCells) {
        let [rowSpanIndex] = attr.split('_');
        console.log('移除了：', attr, rowSpanIndex, rowIndexStr);
        if (rowSpanIndex == rowIndexStr) {
          delete rowSpanCells[attr];
        }
      }
    };

    let dataChangeRandom = ref();
    let realTableData = ref<any[]>([]);
    // TODO 列合并、行合并功能是否应该提取到当前组件计算
    watch(() => [...props.data], function (data) {
      nextTick(function () {
        let now = new Date().getTime();
        realTableData.value = data?.map((dataItem: Record<string, any>, index: number) => {
          return {
            uid: `${index}_${now}`,
            data: dataItem
          };
        });
        // 数据变动后需要让子孙组件知道
        dataChangeRandom.value = new Date().getTime();
      });
    }, { immediate: true });

    // 父级元素是否隐藏了
    let parentElIsHidden = ref(false);
    let calcParentElIsHiddenTimer: number;
    // 判断父级元素是否隐藏了
    let getParentElVisible = function () {
      calcParentElIsHiddenTimer = setInterval(function () {
        console.log('getParentElVisible: 判断父级元素是否隐藏了');
        let isHidden = (tableContainerRef.value?.offsetWidth || 0) <= 0;
        parentElIsHidden.value = isHidden;
        if (!isHidden) {
          clearInterval(calcParentElIsHiddenTimer);
        }
      }, 100);
    };

    // 表格的宽度
    let tableWidth = ref(0);
    let tableRef = ref<HTMLTableElement>();
    let colgroup = ref<{ width: number; minWidth: number }[]>([]);
    let tableContainerRef = ref<HTMLElement>();
    // 计算列宽
    let calcColumnWidth = function (columns: BsTableColumn[]) {
      console.log('table width: ', tableContainerRef.value?.offsetWidth || 0);
      if (parentElIsHidden.value) {
        return;
      }
      let tableContainerWidth = tableContainerRef.value?.offsetWidth || 0;
      let tableEl = tableRef.value;
      let tableBorderLeft = getStyle(tableEl!, 'border-left') || 0;
      let tableBorderRight = getStyle(tableEl!, 'border-right') || 0;
      tableContainerWidth -= tableBorderLeft + tableBorderRight;
      let needColGroup = columns.some(column => {
        return !!column.width || !!column.minWidth;
      });
      if (!needColGroup) {
        colgroup.value = [];
        return;
      }
      let colGroupTemp: { width: number; minWidth: number; }[] = [];
      columns.forEach((column: BsTableColumn) => {
        let { width, minWidth } = column;
        let widthNumber = parseFloat((width || '') as string);
        let minWidthNumber = parseFloat((minWidth || '') as string);
        colGroupTemp.push({
          width: !isNaN(widthNumber) ? Math.abs(widthNumber) : 0,
          minWidth: !isNaN(minWidthNumber) ? Math.abs(minWidthNumber) : 0
        });
      });
      let notNeedColGroup = colGroupTemp.every(colItem => {
        return !colItem.width && !colItem.minWidth;
      });
      if (notNeedColGroup) {
        colgroup.value = [];
        return;
      }
      let defaultWidth = 80;
      let newColGroup = colGroupTemp.map(col => {
        let { width, minWidth } = col;
        let isDefaultWidth = false;
        if (!width && !minWidth) {
          width = defaultWidth;
          isDefaultWidth = true;
        }
        return {
          width,
          minWidth,
          isDefaultWidth
        };
      });
      // 计算列总宽度
      let colTotalWidth = newColGroup.reduce(function (result, col) {
        let { width, minWidth } = col;
        result += minWidth || width;
        return result;
      }, 0);
      console.log('colTotalWidth', colTotalWidth);
      if (colTotalWidth < tableContainerWidth) {
        let widthDiff = tableContainerWidth - colTotalWidth;
        console.log(3333, widthDiff);
        // 查找需要平分剩余宽度的列
        let needCalcWidthCols = newColGroup.filter(col => {
          let { minWidth, isDefaultWidth } = col;
          return !!minWidth || isDefaultWidth;
        });
        let totalWidth = needCalcWidthCols.reduce(function (result, col) {
          result += col.minWidth || col.width;
          return result;
        }, 0);
        needCalcWidthCols.forEach(col => {
          let { width, minWidth } = col;
          let rateWidth = minWidth || width;
          let rate = rateWidth / totalWidth;
          let newWidth = Number((rateWidth + widthDiff * rate).toFixed(3));
          col.width = newWidth;
        });
        tableWidth.value = 0;
      } else {
        newColGroup.forEach(col => {
          let { width, minWidth } = col;
          if (minWidth) {
            col.width = minWidth;
          }
        });
        tableWidth.value = newColGroup.reduce(function (result, col) {
          result += col.width;
          return result;
        }, 0);
      }
      colgroup.value = newColGroup;
      console.log('colgroup', colgroup, tableWidth.value);
    };

    watch(() => [...props.columns], function (columns) {
      nextTick(function () {
        parentElIsHidden.value = (tableContainerRef.value?.offsetWidth || 0) <= 0;
        if (parentElIsHidden.value) {
          getParentElVisible();
        }
        calcColumnWidth(columns);
      });
    }, { immediate: true });

    provide(bsTableCtxKey, {
      dataChangeRandom,
      rowSpanCells,
      addRowSpanCell,
      removeRowSpanCell
    });
    return {
      tableContainerRef,
      tableRef,
      realTableData,
      colgroup,
      tableWidth,
      getRowKey (row: Record<string, any>, rowIndex: number) {
        let rowKey = props.rowKey;
        if (!rowKey) {
          return row.uid;
        }
        if (isFunction(rowKey)) {
          return rowKey(row.data, rowIndex) || row.uid;
        }
        return row.data[rowKey] || row.uid;
      }
    };
  }
});
</script>
