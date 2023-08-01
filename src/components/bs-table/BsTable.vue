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
          v-for="(row, rowIndex) in realTableRows"
          :key="row.uid"
          :row-data="row.rowData"
          :row-index="rowIndex"
          :row-id="row.uid"
          :table-slots="$slots"
          :table-attrs="$attrs"
          :columns="columnsInfo.columns"
          :row-class-name="rowClassName"
          :children-key="childrenKey"
          :is-tree-data="isTreeData"
          :tree-level="row.treeLevel"
          :tree-row-expand="row.treeDataRowExpand"
          :lazy="lazy"
          :is-leaf-key="isLeafKey"
          @expand-change="handleExpandChange">
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
  BsTableColumnInner, BsColgroupItem, BsTableRealRow
} from './bs-table-types';
import BsTableFixedHeader from './wigets/BsTableFixedHeader.vue';
import BsTableHead from './wigets/BsTableHead.vue';
import BsTableRow from './wigets/BsTableRow.vue';
import { isFunction, NOOP } from '@vue/shared';
import { scrollWidth, isNumber, isString, hasScroll, getUUID, jsonSort } from '../../utils/bs-util';
import { sm3HashHex } from '../../utils/sm3Hmac';

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
      let allowExpand = !!props.allowExpand;
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
      if (allowExpand) {
        let expandColumn: BsTableColumnInner = {
          width: props.expandColumnWidth,
          prop: 'bs_expand_column',
          label: props.expandColumnLabel,
          headSlotName: 'expandColumnHeader',
          cellClassName: 'bs-table-expand-cell'
        };
        if (fixedLeftColumns.length > 0) {
          expandColumn.fixed = 'left';
          expandColumn.fixedIndex = 0;
          fixedLeftColumns.unshift(expandColumn);
        } else {
          normalColumns.unshift(expandColumn);
        }
      }

      let fixedLeftColumnCount = fixedLeftColumns.length;
      let fixedRightColumnCount = fixedRightColumns.length;
      fixedLeftColumns.forEach((column: BsTableColumnInner, index) => {
        column.fixedLeftColumnCount = fixedLeftColumnCount;
        if (allowExpand && index != 0) { // 如果有展开列，并且当前列非展开列，则当前的固定列索引加1
          column.fixedIndex! += 1;
        }
      });
      fixedRightColumns.forEach((column: BsTableColumnInner) => column.fixedRightColumnCount = fixedRightColumnCount);
      return {
        columns: [...fixedLeftColumns, ...normalColumns, ...fixedRightColumns],
        hasFixedLeft,
        hasFixedRight,
        hasFixedColumn: hasFixedLeft || hasFixedRight
      };
    });

    // 获取行数据哈希值
    let getRowDataHash = function (rowData: Record<string, any>): string {
      let newRowData = { ...rowData };
      for (let attr in newRowData) {
        let valType = typeof newRowData[attr];
        // 只保留基本数据类型
        if ((valType != 'string' && valType != 'number') || (attr + '').includes('time')) {
          delete newRowData[attr];
        }
      }
      let sortedJson = jsonSort(newRowData);
      return sm3HashHex(JSON.stringify(sortedJson));
    };

    let realTableRows = ref<BsTableRealRow[]>([]);
    // 数据是否为树状
    let isTreeData = ref(false);
    // 展开行的id
    let expandedTreeRowIds: Set<string> = new Set();
    // 构建表格行数据
    let generateTableRow = function (treeData: Record<string, any>[], treeLevel = 1, callback?: (dataItem: Record<string, any>, newRow: BsTableRealRow) => void): BsTableRealRow[] {
      let rowKey = props.rowKey;
      return (treeData || []).map((dataItem: Record<string, any>) => {
        if (isFunction(rowKey)) {
          rowKey = rowKey(dataItem);
        }
        let uid = dataItem[rowKey] || getRowDataHash(dataItem);
        let result = {
          treeDataRowExpand: expandedTreeRowIds.has(uid), // 树状数据时，当前行是否展开了
          treeLevel: treeLevel, // 树的层级
          uid,
          rowData: dataItem,
          children: []
        };
        if (isFunction(callback)) {
          callback(dataItem, result);
        }
        return result;
      });
    };
    // TODO 列合并、行合并功能是否应该提取到当前组件计算
    watch(() => [...props.data], function (data) {
      console.log('table数据发生变化：', data);
      nextTick(function () {
        let childrenKey = props.childrenKey;
        let isTreeDataFlag = false;
        let hasDefaultExpandRow = false;

        realTableRows.value = generateTableRow(data, 1, function (dataItem, row) {
          if (!isTreeDataFlag) {
            let children = dataItem[childrenKey];
            isTreeDataFlag = Array.isArray(children) && children.length > 0;
          }
          if (!hasDefaultExpandRow) {
            hasDefaultExpandRow = row.treeDataRowExpand;
          }
        });
        isTreeData.value = isTreeDataFlag;
        console.log('计算表格行：', [...realTableRows.value]);

        let defaultExpandAllRows = !!props.defaultExpandAllRows;
        // 默认展开的行
        if (hasDefaultExpandRow || defaultExpandAllRows) {
          let doExpandTreeRow = function (rows: BsTableRealRow[]) {
            rows.forEach(row => {
              if (row.treeDataRowExpand || defaultExpandAllRows) {
                row.treeDataRowExpand = false; // 防止调用expandTreeRow函数进行展开时进入折叠逻辑
                expandTreeRow(row.rowData, row.uid, false);
              }
              let childrenRows = row.children;
              if (defaultExpandAllRows) {
                doExpandTreeRow(childrenRows);
              }
            });
          };
          // console.log('realTableRows.value', realTableRows.value);
          doExpandTreeRow([...realTableRows.value]);
        }
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
    // 列信息变化事件
    let handleColumnsChange = function (columnsInfoData: any) {
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
    };
    // 计算是否要显示右侧固定定位列第1列的阴影
    watch(columnsInfo, handleColumnsChange, { immediate: true });

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

    // 展开树状行
    let expandTreeRow = function (rowData: any, rowId: string, expandChildRow = true, callback?: (flag: boolean) => void) {
      let realTableRowsRaw = realTableRows.value;
      let index = realTableRowsRaw.findIndex((rowItem) => rowItem.uid === rowId);

      if (index == -1) {
        return;
      }
      // console.log('expandTreeRow', 'expandTreeRow执行了');
      let row = realTableRowsRaw[index];
      let childrenKey = props.childrenKey;
      let children = row.rowData[childrenKey] || [];
      if (children.length == 0 && props.lazy) {
        return;
      }
      if (!row.treeDataRowExpand) { // 展开
        let rowChildren = generateTableRow(children, row.treeLevel + 1);
        row.children = rowChildren;
        row.treeDataRowExpand = true;
        expandedTreeRowIds.add(row.uid);
        // 在当前行的后面插入新的行
        realTableRowsRaw.splice(index + 1, 0, ...rowChildren);

        if (expandChildRow) { // 是展开子节点行，默认自动展开状态为已展开的子节点行
          rowChildren.forEach(childRowItem => {
            let childRowId = childRowItem.uid;
            if (expandedTreeRowIds.has(childRowId)) { // 如果子节点之前是展开状态，那么此时应该再次展开它
              childRowItem.treeDataRowExpand = false;
              // console.log('展开下级节点：', childRowItem);
              expandTreeRow(rowChildren[childrenKey], childRowItem.uid);
            }
          });
        }
      } else { // 收起
        row.treeDataRowExpand = false;
        expandedTreeRowIds.delete(row.uid);
        console.log('realTableRowsRaw', realTableRowsRaw);
        // realTableRowsRaw.splice(index + 1, children.length);
        // 折叠子节点
        let foldChildren = function (rowChildren: BsTableRealRow[]) {
          rowChildren.forEach(curRow => {
            let curRowId = curRow.uid;
            let index = realTableRowsRaw.findIndex((rowItem) => rowItem.uid === curRowId);
            if (index == -1) { // 如果子节点先折叠起来，那么在realTableRowsRaw中就会找不到，此时就不能再继续移除了
              return;
            }
            realTableRowsRaw.splice(index, 1);
            if (curRow.children.length > 0) {
              foldChildren(curRow.children);
            }
          });
        };
        let timer = setTimeout(function () {
          clearTimeout(timer);
          foldChildren(row.children);
        }, 0);
      }
    };

    provide(bsTableCtxKey, {
      rowSpanCells,
      addRowSpanCell,
      removeRowSpanCell,
      expandTreeRow (rowData: any, rowId: string, expandChildRow = true, callback?: (flag?: boolean) => void) {
        let childrenKey = props.childrenKey;
        let children = rowData[childrenKey] || [];
        if (props.lazy && children.length == 0) {
          let lazyLoadFn = isFunction(props.load) ? props.load : function () { callback!(true); };
          // 调懒加载数据函数加载数据
          lazyLoadFn(rowData, function (isFailed?: boolean) {
            nextTick(function () {
              callback!(isFailed);
              if (!isFailed) {
                expandTreeRow(rowData, rowId);
              }
            });
          });
        } else {
          expandTreeRow(rowData, rowId);
        }
      }
    });
    return {
      tableContainerRef,
      tableFixedHeaderRef,
      tableBodyRef,
      tableRef,
      realTableRows,
      colgroup,
      tableWidth,
      tableHeight,
      tableMaxHeight,
      hasFixedHeader,
      columnsInfo,
      tableBodyScrollInfo,
      isTreeData,
      handleTableBodyScroll,
      getRowKey (row: BsTableRealRow, rowIndex: number) {
        let rowKey = props.rowKey;
        if (!rowKey) {
          return row.uid;
        }
        if (isFunction(rowKey)) {
          return row.rowData[rowKey(row.rowData, rowIndex)] || row.uid;
        }
        return row.rowData[rowKey] || row.uid;
      },
      handleExpandChange () { // 行展开事件
        handleColumnsChange(columnsInfo.value);
      }
    };
  }
});
</script>
