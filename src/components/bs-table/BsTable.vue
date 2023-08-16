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
      :table-body-scroll-width="tableBodyScrollInfo.scrollWidth"
      :selection-config="selectionConfig"
      :table-width="tableWidth || tableWrapWidth"
      :table-rows-count="flattenTableRows.length"
      :checked-rows-count="checkedKeysRoot.size"></BsTableFixedHeader>
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
            }" />
        </colgroup>
        <BsTableHead
          v-if="!hasFixedHeader"
          :columns="columnsInfo.columns"
          :table-slots="$slots"
          :table-body-has-scroll="tableBodyScrollInfo.hasScroll"
          :table-body-scroll-width="tableBodyScrollInfo.scrollWidth"
          :selection-config="selectionConfig"
          :colgroup="colgroup"
          :table-width="tableWidth || tableWrapWidth"
          :table-rows-count="flattenTableRows.length"
          :checked-rows-count="checkedKeysRoot.size"></BsTableHead>
        <tbody class="bs-table-tbody">
          <template v-for="(row, rowIndex) in flattenTableRows">
            <BsTableRow
              v-if="row.visible"
              :key="row.uid"
              :row-data="row.node"
              :row-index="rowIndex"
              :row-id="row.uid"
              :table-slots="$slots"
              :table-attrs="$attrs"
              :columns="columnsInfo.columns"
              :row-class-name="rowClassName"
              :children-key="childrenKey"
              :is-tree-data="isTreeData"
              :tree-level="row.nodeLevel"
              :tree-row-expand="row.treeDataRowExpand"
              :lazy="lazy"
              :is-leaf-key="isLeafKey"
              :selection-config="selectionConfig"
              :table-id="tableId"
              :checked-keys="checkedKeysRoot"
              :half-checked-keys="halfCheckedKeys"
              @expand-change="handleExpandChange">
            </BsTableRow>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  computed, defineComponent, nextTick, provide, reactive, ref, Ref, SetupContext, watch,
  ComponentPublicInstance, onBeforeUnmount, WatchStopHandle, toRef, onUnmounted
} from 'vue';
import {
  bsTableProps, BsTableRowSpanCellInfo, BsTableContext, bsTableCtxKey, BsTableColumn,
  BsTableColumnInner, BsColgroupItem, BsTableRealRow, bsSelectionColumnKey, bsExpandColumnKey,
  BsTableRowData
} from './bs-table-types';
import BsTableFixedHeader from './wigets/BsTableFixedHeader.vue';
import BsTableHead from './wigets/BsTableHead.vue';
import BsTableRow from './wigets/BsTableRow.vue';
import { isFunction, NOOP } from '@vue/shared';
import { scrollWidth, isNumber, isString, hasScroll, getUUID, jsonSort, getPropValueByPath } from '../../utils/bs-util';
import { sm3HashHex } from '../../utils/sm3Hmac';
import { useGlobalEvent } from '../../hooks/useGlobalEvent';
import {
  treeDataToFlattarnArr2,
  findNodeByUid,
  findChildrenNodesByUid,
  findParentsByNodeLevelPath2,
  clearCachedNodeInfo
} from '../bs-tree/bs-tree-utils';
import { useBsTableTree } from './useBsTableTree';

let bsTableCount = 0;
export default defineComponent({
  name: 'BsTable',
  props: bsTableProps,
  components: {
    BsTableHead,
    BsTableRow,
    BsTableFixedHeader
  },
  setup (props: any, ctx: SetupContext) {
    let tableId = `bs_table-${++bsTableCount}`;
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

    // 获取行的uid
    let getRowUid = function (rowData: Record<string, any>) {
      let uid = '';
      let rowKey = props.rowKey;
      if (isFunction(rowKey)) {
        uid = rowKey(rowData);
      } else {
        uid = getPropValueByPath(rowData, rowKey).value || getRowDataHash(rowData);
      }
      return uid;
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
      if (allowExpand) { // 添加一列展开列
        let expandColumn: BsTableColumnInner = {
          width: props.expandColumnWidth,
          prop: bsExpandColumnKey,
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
      let selectionType = (props.selectionConfig?.type + '').toLowerCase();
      let hasSelectionColumn = selectionType == 'checkbox' || selectionType == 'radio';
      if (hasSelectionColumn) { // 添加一列选择列
        let selectionColumn: BsTableColumnInner = {
          width: props.selectionConfig?.columnWidth || 50,
          prop: bsSelectionColumnKey,
          label: '',
          headSlotName: 'selectionColumnHeader',
          cellClassName: 'bs-table-selection-cell'
        };
        var fixedLeftColumn1 = fixedLeftColumns[1];
        if (fixedLeftColumns.length > 0) {
          selectionColumn.fixed = 'left';
          if (allowExpand) { // 如果有展开列，那么选择列需要插入到展开列后面
            selectionColumn.fixedIndex = 1;
            let arr = [fixedLeftColumn1, selectionColumn].filter(item => !!item);
            fixedLeftColumns.splice(1, 0, ...arr);
          } else {
            selectionColumn.fixedIndex = 0;
            fixedLeftColumns.unshift(selectionColumn);
          }
        } else {
          if (allowExpand) { // 如果有展开列，那么选择列需要插入到展开列后面
            let arr = [fixedLeftColumn1, selectionColumn].filter(item => !!item);
            normalColumns.splice(1, 0, ...arr);
          } else {
            normalColumns.unshift(selectionColumn);
          }
        }
      }

      let fixedLeftColumnCount = fixedLeftColumns.length;
      let fixedRightColumnCount = fixedRightColumns.length;
      fixedLeftColumns.forEach((column: BsTableColumnInner, index) => {
        column.fixedLeftColumnCount = fixedLeftColumnCount;
        if (allowExpand) {
          if (index != 0) { // 如果有展开列，并且当前列非展开列，则当前的固定列索引加1
            column.fixedIndex! += 1;
          }
        } else if (hasSelectionColumn && index != 0) {
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
        if ((valType != 'string' && valType != 'number')) {
          delete newRowData[attr];
        }
      }
      let sortedJson = jsonSort(newRowData);
      return sm3HashHex(JSON.stringify(sortedJson));
    };

    // 扁平的表格数据
    let flattenTableRows = ref<BsTableRowData[]>([]);

    let checkedKeysRootOld: Set<string> = new Set();
    let {
      checkedKeysRoot, // 选中行的key
      checkedRowsRoot, // 选中的行
      halfCheckedKeys, // 半选中行的key
      // treeNodeProps,

      addCheckedKey,
      addParentsChecked,
      addSelfAndChildrenChecked,

      removeRowChildren,
      selectAll,
      selectNone,
      selectRow,
      unSelectRow,
      getSelectionInfo
    } = useBsTableTree(props, flattenTableRows, tableId, toRef(props, 'childrenKey'), tableId, getRowDataHash);

    // 数据是否为树状
    let isTreeData = ref(false);
    // 展开行的id
    let expandedTreeRowIds: Set<string> = new Set();
    // 关联父级选择框
    let linkParentCheckbox = function () {
      console.log('linkParentCheckbox 111');
      let checkedKeys = checkedKeysRoot.value;
      if (props.selectionConfig.checkStrictly) {
        checkedKeys.forEach((checkedKey: string) => {
          addCheckedKey(checkedKey);
        });
        return;
      }
      console.log('linkParentCheckbox 222', checkedKeys);
      // 已经处理过的节点的key
      let processedKes: Record<string, any> = {};
      checkedKeys.forEach((checkedKey: string) => {
        if (checkedKey in processedKes) {
          return;
        }
        console.log('linkParentCheckbox 333');
        processedKes[checkedKey] = 1;
        addSelfAndChildrenChecked(checkedKey);
        addParentsChecked(checkedKey);
      });
    };

    // TODO 列合并、行合并功能是否应该提取到当前组件计算
    let isInited = false;
    watch(() => [...props.data], function (data) {
      console.log('table数据发生变化：', data);
      nextTick(function () {
        let childrenKey = props.childrenKey;
        let isTreeDataFlag = false;

        let newFlattenTableRowData: BsTableRowData[] = [];
        let defaultExpandAllRows = !!props.defaultExpandAllRows;

        // 默认需要展开的行
        let needExpandRows: BsTableRowData[] = [];
        // 扁平化树数据
        treeDataToFlattarnArr2(tableId, data, props.childrenKey, '', 1, '', newFlattenTableRowData, function (treeNodeInfo: any) {
          treeNodeInfo.treeDataRowExpand = false; // 树状数据时，当前行是否展开了
          let nodeData = treeNodeInfo.node;
          if (!isTreeDataFlag) {
            let children = nodeData[childrenKey];
            isTreeDataFlag = Array.isArray(children) && children.length > 0;
          }
          let uid = getRowUid(nodeData);
          treeNodeInfo.uid = uid;
          let visible = false;

          if (treeNodeInfo.nodeLevel == 1) { // 第一级的节点默认显示出来
            visible = true;
          }
          treeNodeInfo.visible = visible;

          // 展开之前已经展开过的行，或者默认全部展开
          if (expandedTreeRowIds.has(uid) || (defaultExpandAllRows && treeNodeInfo.nodeLevel == 1)) {
            needExpandRows.push(treeNodeInfo);
          }
        });
        console.log('isTreeDataFlag', isTreeDataFlag, defaultExpandAllRows, newFlattenTableRowData);
        isTreeData.value = isTreeDataFlag;
        flattenTableRows.value = newFlattenTableRowData;

        if (needExpandRows.length > 0) {
          // console.log('defaultExpandAllRows', defaultExpandAllRows);
          let timer = setTimeout(function () {
            clearTimeout(timer);
            needExpandRows.forEach(rowItem => {
              expandTreeRow(rowItem.node, rowItem.uid, defaultExpandAllRows);
            });
          }, 0);
        }

        // 展开默认需要展开的行
        expandDefaultExpandedRows();

        // 判断当数据被删除时是否仍然保留选项的key
        if (!props.selectionConfig.reserveSelectedRowKeys) {
          checkedKeysRoot.value = new Set(props.checkedKeys);
          halfCheckedKeys.value = new Set();
          checkedKeysRootOld = new Set();
        } else {
          checkedKeysRootOld = checkedKeysRoot.value;
          checkedKeysRoot.value = new Set();
        }

        let timer = setTimeout(function () {
          clearTimeout(timer);
          clearCachedNodeInfo(tableId);
          if (isInited) { // 还未进行初始化的时候不执行linkParentCheckbox函数，因为下面的watch props.checkedKeys会执行
            linkParentCheckbox();
          }
          isInited = true;
        }, 0);
      });
    }, { immediate: true });

    let watchCheckedKeysTimer: number;
    watch(() => [...props.checkedKeys], function (checkedKeys) {
      clearTimeout(watchCheckedKeysTimer);
      console.log('watch checkedKeys 111');
      watchCheckedKeysTimer = setTimeout(function () {
        clearTimeout(watchCheckedKeysTimer);
        let checkedKeysRootArr = Array.from(checkedKeysRoot.value);
        let checkedKeysSorted = checkedKeys.slice(0).sort();
        let checkedKeysRootSorted = checkedKeysRootArr.sort();
        console.log('watch checkedKeys 222');
        // 当用户手动改变了复选框的值，那么 checkedKeys 会等于 checkedKeysRoot.value
        if (checkedKeysSorted.join(',') === checkedKeysRootSorted.join(',')) {
          return;
        }
        console.log('watch checkedKeys 333');
        if (props.selectionConfig?.type == 'radio') {
          checkedKeysRoot.value = new Set([checkedKeys[0]]);
        } else {
          checkedKeysRoot.value = new Set([...checkedKeys, ...Array.from(checkedKeysRootOld)]);
        }

        if (checkedKeys.length == 0) {
          halfCheckedKeys.value = new Set();
          return;
        }
        linkParentCheckbox();
      }, 0);
    }, { immediate: true });

    // 展开默认需要展开的行
    let expandDefaultExpandedRows = function () {
      let defaultExpandedRowKeys: string[] = props.defaultExpandedRowKeys || [];
      if (defaultExpandedRowKeys.length > 0 && !props.lazy && !props.defaultExpandAllRows && stopWatchDefaultExpandedRows) {
        let timer2 = setTimeout(function () {
          clearTimeout(timer2);
          stopWatchDefaultExpandedRows?.(); // defaultExpandedRowKeys只执行一次
          stopWatchDefaultExpandedRows = null;
          let flattenTableRowsRaw = flattenTableRows.value;
          defaultExpandedRowKeys.forEach(rowKey => {
            let row = findNodeByUid(tableId, rowKey, flattenTableRowsRaw);
            if (!row) {
              return;
            }
            let rowParents = findParentsByNodeLevelPath2(row.nodeLevelPath, flattenTableRowsRaw);
            // 先展开所有父级
            rowParents.forEach(parentItem => {
              if (parentItem.treeDataRowExpand) {
                return;
              }
              expandTreeRow(parentItem.node, parentItem.uid, false);
            });
            // 再展开自己
            if (!row.treeDataRowExpand) {
              expandTreeRow(row.node, rowKey, false);
            }
          });
        }, 0);
      }
    };
    let stopWatchDefaultExpandedRows: WatchStopHandle|null = watch(() => [...props.defaultExpandedRowKeys], function () {
      expandDefaultExpandedRows();
    });

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
    let tableWrapWidth = ref(0);
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

      let tableContainerScrollWidth = scrollWidth(tableBodyRef.value).vertical;
      // console.log('tableContainerScrollWidth', tableContainerWidth, tableContainerScrollWidth);
      tableContainerWidth -= tableContainerScrollWidth;
      tableWrapWidth.value = tableContainerWidth;
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
        // console.log(3333, widthDiff);
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
    let handleColumnsChange = function (columnsInfoData: any, calcColumnWidthFlag = true) {
      clearTimeout(calcRightPingTimer);
      nextTick(function () {
        parentElIsHidden.value = (tableContainerRef.value?.offsetWidth || 0) <= 0;
        if (parentElIsHidden.value) {
          getParentElVisible();
        }
        if (calcColumnWidthFlag !== false) {
          calcColumnWidth(columnsInfoData.columns);
        }
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
      let flattenTableRowsRaw = flattenTableRows.value;
      let row = findNodeByUid(tableId, rowId, flattenTableRowsRaw);
      if (!row) {
        return;
      }

      let childrenKey = props.childrenKey;
      let children = row.node[childrenKey] || [];
      if (children.length == 0) {
        return;
      }
      let childrenRows = findChildrenNodesByUid<BsTableRowData>(tableId, rowId, flattenTableRowsRaw);
      if (!row.treeDataRowExpand) { // 展开
        // console.log('展开行：', rowId, rowData, childrenRows);
        row.treeDataRowExpand = true;
        expandedTreeRowIds.add(row.uid);
        // 显示子节点
        childrenRows.forEach((childRow) => {
          childRow.visible = true;
        });
        // console.log('expandChildRow', expandChildRow);
        childrenRows.forEach(childRowItem => {
          let childRowId = childRowItem.uid;
          if (expandedTreeRowIds.has(childRowId)) { // 如果子节点之前是展开状态，那么此时应该再次展开它
            childRowItem.treeDataRowExpand = false;
            expandTreeRow(childRowItem.node, childRowId, expandChildRow, callback);
          } else if (expandChildRow) {
            expandTreeRow(childRowItem.node, childRowId, expandChildRow, callback);
          }
        });
      } else { // 收起
        row.treeDataRowExpand = false;
        expandedTreeRowIds.delete(row.uid);
        // console.log('收起行：', rowId, rowData);
        // 折叠子节点
        let foldChildren = function (rows: BsTableRowData[]) {
          rows.forEach(childRowItem => {
            childRowItem.visible = false;
            let children = findChildrenNodesByUid<BsTableRowData>(tableId, childRowItem.uid, flattenTableRowsRaw);
            if (children.length > 0) {
              foldChildren(children);
            }
          });
        };
        foldChildren(childrenRows);
      }
    };

    /* // 获取选中行的信息
    let getSelectionInfo = function () {
      let flattenTableRowsRaw = flattenTableRows.value;

      let selectedRowKeys = Array.from(checkedKeysRoot.value);
      let selectedRows = selectedRowKeys.map(rowKey => {
        return findNodeByUid(tableId, rowKey, flattenTableRowsRaw)?.node;
      }).filter(row => !!row);

      let halfSelectedRowKeys = Array.from(halfCheckedKeys.value);
      let halfSelectedRows = halfSelectedRowKeys.map(rowKey => {
        return findNodeByUid(tableId, rowKey, flattenTableRowsRaw)?.node;
      }).filter(row => !!row);

      return {
        selectedRowKeys,
        selectedRows,
        halfSelectedRowKeys,
        halfSelectedRows
      };
    };

    // 选择所有行
    let selectAll = function () {
      let { type, checkStrictly, onSelectChange } = props.selectionConfig;
      if (type != 'checkbox') {
        return;
      }
      flattenTableRows.value.forEach(rowInfo => {
        let { uid, isDisabled, nodeLevel } = rowInfo;
        if (checkStrictly) {
          addCheckedKey(uid);
        } else {
          if (nodeLevel == 1) { // 从最顶层开始选择
            addSelfAndChildrenChecked(uid);
          }
        }
      });
      let selectionInfo = getSelectionInfo();
      if (isFunction(onSelectChange)) {
        onSelectChange({
          row: null,
          isSelected: true,
          operateType: 'selectAll',
          isHalfSelected: false,
          ...selectionInfo
        });
      }
    };

    // 取消选择所有行
    let selectNone = function () {
      let { type, checkStrictly, onSelectChange } = props.selectionConfig;
      if (type != 'checkbox') {
        return;
      }
      flattenTableRows.value.forEach(rowInfo => {
        let { uid, isDisabled, nodeLevel } = rowInfo;
        if (checkStrictly) {
          removeCheckedKey(uid);
        } else {
          if (nodeLevel == 1) { // 从最顶层开始选择
            removeSelfAndChildrenChecked(uid);
          }
        }
      });
      let selectionInfo = getSelectionInfo();
      if (isFunction(onSelectChange)) {
        onSelectChange({
          row: null,
          isSelected: false,
          operateType: 'selectNone',
          isHalfSelected: false,
          ...selectionInfo
        });
      }
    };

    // 添加选中行
    let selectRow = function (rowKey: string, rowData?: Record<string, any>) {
      if (!checkedKeysRoot.value.has(rowKey)) {
        let { type, checkStrictly, onSelectChange } = props.selectionConfig;
        if (type == 'checkbox') {
          if (!checkStrictly) {
            // 添加自己及子孙节点的选中状态
            addSelfAndChildrenChecked(rowKey);
            // 添加父级节点的选中状态
            addParentsChecked(rowKey);
          } else {
            addCheckedKey(rowKey);
          }
        } else if (props.showRadio) {
          checkedKeysRoot.value = new Set([rowKey]);
        }
        let selectionInfo = getSelectionInfo();
        if (isFunction(onSelectChange)) {
          if (!rowData) {
            rowData = findNodeByUid(tableId, rowKey, flattenTableRows.value)?.node;
          }
          onSelectChange({
            row: rowData,
            isSelected: true,
            operateType: 'selectSingle',
            isHalfSelected: halfCheckedKeys.value.has(rowKey),
            ...selectionInfo
          });
        }
      }
    };

    // 移除选中项
    let unSelectRow = function (rowKey: string, rowData?: Record<string, any>) {
      let { type, checkStrictly, onSelectChange } = props.selectionConfig;
      if (type == 'checkbox') {
        if (!checkStrictly) {
          // 移除自己及子孙节点的选中状态
          removeSelfAndChildrenChecked(rowKey);
          // 移除父级节点的选中状态
          removeParentsChecked(rowKey);
        } else {
          removeCheckedKey(rowKey);
        }
      } else {
        removeCheckedKey(rowKey);
      }
      let selectionInfo = getSelectionInfo();
      if (isFunction(onSelectChange)) {
        if (!rowData) {
          rowData = findNodeByUid(tableId, rowKey, flattenTableRows.value)?.node;
        }
        onSelectChange({
          row: rowData,
          isSelected: false,
          operateType: 'selectSingle',
          isHalfSelected: halfCheckedKeys.value.has(rowKey),
          ...selectionInfo
        });
      }
    };

    // 移除行的下级节点（给外部使用的）
    let removeRowChildren = function (rowData: Record<string, any>) {
      let uid = '';
      let rowKey = props.rowKey;
      if (isFunction(rowKey)) {
        uid = rowKey(rowData);
      } else {
        uid = getPropValueByPath(rowData, rowKey).value || getRowDataHash(rowData);
      }
      let flattenTableRowsRaw = flattenTableRows.value;
      let rowIndex = flattenTableRowsRaw.findIndex(rowItem => rowItem.uid == uid);

      if (rowIndex < 0) {
        return;
      }
      let row = flattenTableRowsRaw[rowIndex];
      let nodeLevelPath = row.nodeLevel;
      for (let i = flattenTableRowsRaw.length - 1; i > rowIndex; i--) {
        let rowItem = flattenTableRowsRaw[i];
        if (rowItem.nodeLevelPath.startsWith(nodeLevelPath + '_')) {
          flattenTableRowsRaw.splice(i, 1);
        }
      }
      delete row.node[props.childrenKey];
    }; */

    // window resize事件
    let lastResizeTime = 0;
    let childrenResizeEvts: (() => void) [] = [];
    let onResize = function () {
      let now = new Date().getTime();
      if (lastResizeTime != 0 && now - lastResizeTime < 100) {
        return;
      }
      lastResizeTime = now;
      console.log('resize 事件执行了');
      handleColumnsChange(columnsInfo.value);
      [...childrenResizeEvts].forEach(evtFn => {
        try {
          evtFn();
        } catch (e) {
          console.error(e);
        }
      });
    };
    useGlobalEvent.addEvent('window', 'resize', onResize);
    onBeforeUnmount(function () {
      useGlobalEvent.removeEvent('window', 'resize', onResize);
    });

    let setColWidthTimer: number;
    provide(bsTableCtxKey, {
      tableWidth,
      rowSpanCells,
      addRowSpanCell,
      removeRowSpanCell,
      checkedKeysRoot,
      halfCheckedKeys,
      // 展开树状结构行
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
                let flattenTableRowsRaw = flattenTableRows.value;
                let rowIndex = flattenTableRowsRaw.findIndex(rowItem => rowItem.uid == rowId);
                if (rowIndex < 0) {
                  return;
                }
                let row = flattenTableRowsRaw[rowIndex];

                let newChildren = rowData[childrenKey];
                let childrenRowData: BsTableRowData[] = [];
                // 扁平化树数据
                treeDataToFlattarnArr2(tableId, newChildren, props.childrenKey, '', row.nodeLevel + 1, row.nodeLevelPath, childrenRowData, function (treeNodeInfo: any) {
                  treeNodeInfo.treeDataRowExpand = false; // 树状数据时，当前行是否展开了
                  let nodeData = treeNodeInfo.node;
                  let uid = getRowUid(nodeData);
                  treeNodeInfo.uid = uid;
                  treeNodeInfo.visible = false;
                });
                childrenRowData.unshift(row);
                flattenTableRowsRaw.splice(rowIndex, 1, ...childrenRowData);

                nextTick(function () {
                  expandTreeRow(rowData, rowId, false);
                });
              }
            });
          });
        } else {
          expandTreeRow(rowData, rowId, false);
        }
      },
      addResizeEvent (callback: () => void) {
        if (!childrenResizeEvts.includes(callback)) {
          childrenResizeEvts.push(callback);
        }
      },
      removeResizeEvent (callback: () => void) {
        let index = childrenResizeEvts.findIndex(item => item === callback);
        if (index > -1) {
          childrenResizeEvts.splice(index, 1);
        }
      },
      // 设置列宽
      setColWidth (colIndex: number, width: number) {
        let colgroupRaw = colgroup.value;
        let col = colgroupRaw[colIndex];
        if (!col) {
          return;
        }
        col.width = Number(width.toFixed(2));
        clearTimeout(setColWidthTimer);
        setColWidthTimer = setTimeout(function () {
          clearTimeout(setColWidthTimer);
          handleColumnsChange(columnsInfo.value, false);
        }, 0);
      },
      // 设置行选择禁用
      setRowSelectionDisabled (rowId: string, disabled: boolean) {
        let row = findNodeByUid(tableId, rowId, flattenTableRows.value);
        if (!row) {
          return;
        }
        row.isDisabled = disabled;
      },
      // 获取选中项信息
      getSelectionInfo,
      // 添加选中项
      addCheckedKey (nodeValue: string, nodeData: Record<string, any>, hasChildren: boolean) {
        selectRow(nodeValue, nodeData);
      },
      // 移除选中项
      removeCheckedKey (nodeValue: string, nodeData: Record<string, any>, hasChildren: boolean) {
        unSelectRow(nodeValue, nodeData);
      },
      selectAll,
      selectNone
    });

    onUnmounted(function () {
      clearCachedNodeInfo(tableId);
    });

    return {
      tableId,
      flattenTableRows,
      tableContainerRef,
      tableFixedHeaderRef,
      tableBodyRef,
      tableRef,
      colgroup,
      tableWidth,
      tableWrapWidth,
      tableHeight,
      tableMaxHeight,
      hasFixedHeader,
      columnsInfo,
      tableBodyScrollInfo,
      isTreeData,
      checkedKeysRoot,
      halfCheckedKeys,
      handleTableBodyScroll,
      handleExpandChange () { // 行展开事件
        handleColumnsChange(columnsInfo.value);
      },

      // 对外暴露的函数
      getSelectionInfo,
      removeRowChildren,
      selectAll,
      selectNone,
      selectRow,
      unSelectRow
    };
  }
});
</script>
