<template>
<div
  ref="tableContainerRef"
  class="bs-table"
  :class="{
    'table-striped': stripe,
    'table-bordered': border,
    'table-borderless': borderless,
    'bs-table-sm': size == 'sm',
    'bs-table-has-fixed-header': hasFixedHeader,
    'bs-table-has-fixed-column': columnsInfo.hasFixedColumn,
    'bs-table-has-fixed-left-column': columnsInfo.hasFixedLeft,
    'bs-table-has-fixed-right-column': columnsInfo.hasFixedRight,
    'bs-table-ping-left': tableBodyScrollInfo.scrollLeft > 0,
    'bs-table-ping-right': tableBodyScrollInfo.showRightPing && !tableBodyScrollInfo.isInScrollEnd
  }">
  <div
    class="bs-table-wrapper"
    :style="{
      height: tableHeight,
      maxHeight: tableMaxHeight
    }">
    <BsTableFixedHeader
      v-if="hasFixedHeader"
      ref="tableFixedHeaderRef"
      :width="tableWidth"
      :columns="columnsInfo.columns"
      :colgroup="colgroup"
      :table-slots="$slots"
      :table-body-has-scroll="tableBodyScrollInfo.hasScroll"
      :table-body-scroll-width="tableBodyScrollInfo.scrollWidth"></BsTableFixedHeader>
    <div
      ref="tableBodyRef"
      class="bs-table-body"
      @scroll="handleTableBodyScroll">
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
          v-if="!hasFixedHeader"
          :columns="columnsInfo.columns"
          :table-slots="$slots"
          :table-body-has-scroll="tableBodyScrollInfo.hasScroll"
          :table-body-scroll-width="tableBodyScrollInfo.scrollWidth"></BsTableHead>
        <tbody class="bs-table-tbody">
        <BsTableRow
          v-for="(row, rowIndex) in realTableData"
          :key="getRowKey(row, rowIndex)"
          :row-data="row.data"
          :row-index="rowIndex"
          :table-slots="$slots"
          :columns="columnsInfo.columns"
          :row-class-name="rowClassName">
        </BsTableRow>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  computed, defineComponent, nextTick, provide, reactive, ref, Ref, SetupContext, watch,
  ComponentPublicInstance
} from 'vue';
import {
  bsTableProps, BsTableRowSpanCellInfo, BsTableContext, bsTableCtxKey, BsTableColumn,
  BsTableColumnInner, BsColgroupItem
} from './bs-table-types';
import BsTableFixedHeader from './wigets/BsTableFixedHeader.vue';
import BsTableHead from './wigets/BsTableHead.vue';
import BsTableRow from './wigets/BsTableRow.vue';
import { isFunction } from '@vue/shared';
import { scrollWidth, isNumber, isString, hasScroll } from '../../utils/bs-util';

interface ColSpanCellInfo {
  colSpan: number; // 合并列数
  cellIndex: number; // 需要合并的列的索引
}

export default defineComponent({
  name: 'BsTable',
  props: bsTableProps,
  components: {
    BsTableHead,
    BsTableRow,
    BsTableFixedHeader
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

    // 列信息
    let columnsInfo = computed(function () {
      let columns = props.columns || [];
      let fixedLeftColumns: BsTableColumnInner[] = [];
      let fixedRightColumns: BsTableColumnInner[] = [];
      let normalColumns: BsTableColumnInner[] = [];
      let hasFixedLeft = false;
      let hasFixedRight = false;
      columns.forEach((column: BsTableColumn, index: number) => {
        let isFixedLeft = column.fixed === true || (column.fixed + '').toLowerCase() == 'left';
        let isFixedRight = (column.fixed + '').toLowerCase() == 'right';
        let newColumn = { ...column } as BsTableColumnInner;
        if (isFixedLeft) {
          hasFixedLeft = true;
          newColumn.fixedIndex = fixedLeftColumns.length;
          fixedLeftColumns.push(newColumn);
        } else if (isFixedRight) {
          hasFixedRight = true;
          newColumn.fixedIndex = fixedRightColumns.length;
          fixedRightColumns.push(newColumn);
        } else {
          normalColumns.push(newColumn);
        }
      });
      let fixedLeftColumnCount = fixedLeftColumns.length;
      let fixedRightColumnCount = fixedRightColumns.length;
      fixedLeftColumns.forEach((column: BsTableColumnInner) => column.fixedLeftColumnCount = fixedLeftColumnCount);
      fixedRightColumns.forEach((column: BsTableColumnInner) => column.fixedRightColumnCount = fixedRightColumnCount);
      return {
        columns: [...fixedLeftColumns, ...normalColumns, ...fixedRightColumns],
        hasFixedLeft,
        hasFixedRight,
        hasFixedColumn: hasFixedLeft || hasFixedRight
      };
    });

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

    let computeTableHeight = function (height: string|number): string {
      if (isNumber(height)) {
        if (height <= 0) {
          return '';
        }
        return height + 'px';
      }
      if (isString(height)) {
        let parsedNumber = parseFloat(height as string);
        if ((height as string).length == 0 || (!isNaN(parsedNumber) && parsedNumber <= 0)) {
          return '';
        }
        return height as string;
      }
      return '';
    };
    // table的高度及最大高度
    let tableHeight = computed(function () {
      return computeTableHeight(props.height);
    });
    let tableMaxHeight = computed(function () {
      return computeTableHeight(props.maxHeight);
    });
    // 是否需要固定表头
    let hasFixedHeader = computed(function () {
      return !!(tableHeight.value || tableMaxHeight.value);
    });

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
    let colgroup = ref<BsColgroupItem[]>([]);
    let tableContainerRef = ref<HTMLElement>();
    // 计算列宽
    let calcColumnWidth = function (columns: BsTableColumn[]) {
      if (parentElIsHidden.value) {
        return;
      }
      let tableContainerWidth = tableBodyRef.value?.clientWidth || 0;
      let isFixedHeaderRaw = hasFixedHeader.value;
      // let tableEl = tableRef.value;
      // let tableBorderLeft = getStyle(tableEl!, 'border-left') || 0;
      // let tableBorderRight = getStyle(tableEl!, 'border-right') || 0;
      // tableContainerWidth -= tableBorderLeft + tableBorderRight;
      let tableContainerScrollWidth = scrollWidth(tableBodyRef.value).vertical;
      console.log('tableContainerScrollWidth', tableContainerWidth, tableContainerScrollWidth);
      tableContainerWidth -= tableContainerScrollWidth;
      let needColGroup = columns.some(column => {
        return !!column.width || !!column.minWidth;
      });
      if (!needColGroup && !isFixedHeaderRaw) {
        colgroup.value = [];
        return;
      }
      let colGroupTemp: { width: number; minWidth: number; name: string; }[] = [];
      columns.forEach((column: BsTableColumn) => {
        let { width, minWidth } = column;
        let widthNumber = parseFloat((width || '') as string);
        let minWidthNumber = parseFloat((minWidth || '') as string);
        colGroupTemp.push({
          width: !isNaN(widthNumber) ? Math.abs(widthNumber) : 0,
          minWidth: !isNaN(minWidthNumber) ? Math.abs(minWidthNumber) : 0,
          name: column.prop
        });
      });
      let notNeedColGroup = colGroupTemp.every(colItem => {
        return !colItem.width && !colItem.minWidth;
      });
      if (notNeedColGroup && !isFixedHeaderRaw) {
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
          isDefaultWidth,
          name: col.name
        };
      });
      // 计算列总宽度
      let colTotalWidth = newColGroup.reduce(function (result, col) {
        let { width, minWidth } = col;
        result += minWidth || width;
        return result;
      }, 0);
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

    /* watch(() => [...props.columns], function (columns) {
      nextTick(function () {
        parentElIsHidden.value = (tableContainerRef.value?.offsetWidth || 0) <= 0;
        if (parentElIsHidden.value) {
          getParentElVisible();
        }
        calcColumnWidth(columns);
      });
    }, { immediate: true }); */

    let tableBodyScrollInfo = reactive({
      scrollLeft: 0,
      isInScrollEnd: false,
      showRightPing: false,
      hasScroll: false,
      scrollWidth: 0
    });
    let tableBodyRef = ref<HTMLElement>();
    let calcRightPingTimer: number;
    // 计算是否要显示右侧固定定位列第1列的阴影
    watch(columnsInfo, function (columnsInfoData) {
      clearTimeout(calcRightPingTimer);
      nextTick(function () {
        parentElIsHidden.value = (tableContainerRef.value?.offsetWidth || 0) <= 0;
        if (parentElIsHidden.value) {
          getParentElVisible();
        }
        calcColumnWidth(columnsInfoData.columns);
      });
      calcRightPingTimer = setTimeout(function () {
        let tableBodyEl = tableBodyRef.value;
        let tableBodyElHasScroll = false;
        if (tableBodyEl) {
          console.log('滚动条宽度：', scrollWidth(tableBodyEl));
          tableBodyElHasScroll = hasScroll(tableBodyEl).vertical;
          tableBodyScrollInfo.scrollWidth = scrollWidth(tableBodyEl).vertical;
        }
        tableBodyScrollInfo.hasScroll = tableBodyElHasScroll;
        if (!columnsInfoData.hasFixedRight || !tableBodyEl) {
          tableBodyScrollInfo.showRightPing = false;
          return;
        }
        tableBodyScrollInfo.showRightPing = tableBodyEl.scrollWidth > tableBodyEl.offsetWidth;
      }, 60);
    }, { immediate: true });

    let tableFixedHeaderRef = ref<ComponentPublicInstance>();
    // table 滚动事件
    let handleTableBodyScroll = function (evt: MouseEvent) {
      let target = evt.target as HTMLElement;
      let scrollLeft = target.scrollLeft;
      tableBodyScrollInfo.scrollLeft = scrollLeft;
      tableBodyScrollInfo.isInScrollEnd = (target.offsetWidth + scrollLeft) == target.scrollWidth;
      // console.log('(target.offsetWidth + scrollLeft) == target.scrollWidth', tableBodyScrollInfo.isInScrollEnd, target.offsetWidth, scrollLeft, target.scrollWidth)
      if (hasFixedHeader.value) {
        let tableFixedHeaderEl = tableFixedHeaderRef.value?.$el;
        if (tableFixedHeaderEl) {
          tableFixedHeaderEl.scrollLeft = scrollLeft;
        }
      }
    };

    provide(bsTableCtxKey, {
      dataChangeRandom,
      rowSpanCells,
      addRowSpanCell,
      removeRowSpanCell
    });
    return {
      tableContainerRef,
      tableFixedHeaderRef,
      tableBodyRef,
      tableRef,
      realTableData,
      colgroup,
      tableWidth,
      tableHeight,
      tableMaxHeight,
      hasFixedHeader,
      columnsInfo,
      tableBodyScrollInfo,
      handleTableBodyScroll,
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
