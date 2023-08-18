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
      :table-rows-count="flattenTableRows2.length"
      :checked-rows-count="checkedRowsCurrent.size"></BsTableFixedHeader>
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
          :table-rows-count="flattenTableRows2.length"
          :checked-rows-count="checkedRowsCurrent.size"></BsTableHead>
        <tbody class="bs-table-tbody">
          <template v-for="(row, rowIndex) in flattenTableRows2">
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
          <tr v-if="!Array.isArray(data) || data.length == 0" class="bs-table-empty-row">
            <td class="bs-table-cell" :colspan="colgroup.length">
              <slot name="empty">
                <div class="bs-table-empty-content">
                  <div class="bs-table-empty-icon-box">
                    <svg viewBox="0 0 1567 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M156.662278 699.758173h21.097186A10.444152 10.444152 0 0 1 187.994733 710.202325c0 5.765172-4.490985 10.444152-10.235269 10.444152H156.662278v21.097186A10.444152 10.444152 0 0 1 146.218126 751.978932a10.277045 10.277045 0 0 1-10.444152-10.235269V720.646477H114.676787A10.444152 10.444152 0 0 1 104.441518 710.202325c0-5.765172 4.490985-10.444152 10.235269-10.444152H135.773974v-21.097187A10.444152 10.444152 0 0 1 146.218126 668.425717c5.765172 0 10.444152 4.490985 10.444152 10.235269v21.097187z m1378.628042-83.553215v-21.097186A10.277045 10.277045 0 0 0 1524.846168 584.872503a10.444152 10.444152 0 0 0-10.444152 10.235269v21.097186h-21.097186a10.277045 10.277045 0 0 0-10.235269 10.444152c0 5.598065 4.595427 10.444152 10.235269 10.444152h21.097186v21.097187c0 5.744284 4.67898 10.235269 10.444152 10.235268a10.444152 10.444152 0 0 0 10.444152-10.235268V637.093262h21.097187c5.744284 0 10.235269-4.67898 10.235268-10.444152a10.444152 10.444152 0 0 0-10.235268-10.444152H1535.29032zM776.460024 960.861969H250.596979A20.80475 20.80475 0 0 1 229.77134 939.973665c0-11.530344 9.462402-20.888304 20.825639-20.888303h94.728457A83.010119 83.010119 0 0 1 334.212859 877.413196v-605.96969A83.49055 83.49055 0 0 1 417.849627 187.994733H480.430984V167.001988A83.49055 83.49055 0 0 1 564.067752 83.553215h501.152182A83.448773 83.448773 0 0 1 1148.856702 167.001988v605.969689c0 15.185797-4.052331 29.410732-11.133466 41.672166h115.554096c11.551232 0 20.909192 9.274407 20.909192 20.888304 0 11.530344-9.295295 20.888304-20.888304 20.888304H1002.638576v20.992745c0 15.185797-4.052331 29.410732-11.133466 41.672166h11.196131c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304h-109.893365c9.545955 16.000441 7.478013 36.972297-6.41271 50.863019a41.672166 41.672166 0 0 1-59.072122 0L776.460024 960.861969z m76.367638-41.776607h66.424806c22.977134 0 41.609501-18.59059 41.609501-41.881049V270.461756c0-22.559368-18.047494-40.690416-40.314426-40.690416H416.303892c-22.266932 0-40.314426 18.214601-40.314426 40.690416v606.742557c0 23.123352 18.799473 41.881049 41.588613 41.881049h317.084449l-10.736588-10.757477a41.693054 41.693054 0 0 1-10.861918-40.377091l-19.718558-19.739447A146.259902 146.259902 0 0 1 502.363703 627.693525a146.218126 146.218126 0 0 1 220.517822 190.981761l19.739447 19.739447a41.630389 41.630389 0 0 1 40.377091 10.841029L852.827662 919.085362zM1002.638576 814.643843h62.852906A41.797496 41.797496 0 0 0 1107.080095 772.867236V167.106429c0-23.14424-18.632367-41.776607-41.588613-41.776607H563.775316A41.797496 41.797496 0 0 0 522.207592 167.106429v20.888304h396.794216A83.448773 83.448773 0 0 1 1002.638576 271.443506V814.643843zM266.325872 46.998683h31.123572c8.773088 0 15.875111 6.955805 15.875111 15.666228 0 8.647758-7.102023 15.666228-15.875111 15.666228h-31.123572v31.123572c0 8.773088-6.955805 15.875111-15.666228 15.875111a15.770669 15.770669 0 0 1-15.666228-15.875111V78.331139H203.869844A15.728893 15.728893 0 0 1 187.994733 62.664911c0-8.647758 7.102023-15.666228 15.875111-15.666228h31.123572V15.875111c0-8.773088 6.955805-15.875111 15.666228-15.875111 8.647758 0 15.666228 7.102023 15.666228 15.875111v31.123572zM20.888304 939.973665c0-11.530344 9.462402-20.888304 20.825638-20.888303h125.455152c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304H41.713942A20.80475 20.80475 0 0 1 20.888304 939.973665z m658.733544-135.021995a104.441518 104.441518 0 1 0-147.722083-147.722083 104.441518 104.441518 0 0 0 147.722083 147.722083zM459.542681 313.324555a20.888304 20.888304 0 0 1 20.867415-20.888304H710.202325a20.888304 20.888304 0 1 1 0 41.776608H480.430984A20.825639 20.825639 0 0 1 459.542681 313.324555z m0 104.441518c0-11.530344 9.295295-20.888304 20.742085-20.888303h334.505295c11.44679 0 20.742086 9.274407 20.742086 20.888303 0 11.530344-9.295295 20.888304-20.742086 20.888304H480.284766A20.762974 20.762974 0 0 1 459.542681 417.766073z m0 104.441519c0-11.530344 9.316183-20.888304 20.846527-20.888304h146.301679c11.509455 0 20.846527 9.274407 20.846527 20.888304 0 11.530344-9.316183 20.888304-20.846527 20.888303h-146.301679A20.80475 20.80475 0 0 1 459.542681 522.207592zM62.664911 396.87777a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911zM1357.739739 271.547948a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911z" fill="currentColor"></path></svg>
                  </div>
                  <div class="bs-table-empty-text">暂无数据</div>
                </div>
              </slot>
            </td>
          </tr>
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

    // 是否有选择列（这里不能采用computed计算，如果采用computed，当props.selectionConfig变化时会导致columnsInfo重新计算。selectionColumnWidth同理）
    let hasSelectionColumn = ref(false);
    // 选择列列宽
    let selectionColumnWidth = ref<string|number>(50);

    // 列信息
    let columnsInfo = computed(function () {
      let columns = props.columns || [];
      let allowExpand = !!props.allowExpand;
      let fixedLeftColumns: BsTableColumnInner[] = [];
      let fixedRightColumns: BsTableColumnInner[] = [];
      let normalColumns: BsTableColumnInner[] = [];
      let hasFixedLeft = false;
      let hasFixedRight = false;
      console.log('计算列信息', 111111);
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

      if (hasSelectionColumn.value) { // 添加一列选择列
        let selectionColumn: BsTableColumnInner = {
          width: selectionColumnWidth.value,
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
    // 真正用于展示的表格数据（防止数据更新后表格出现抖动问题）
    let flattenTableRows2 = ref<BsTableRowData[]>([]);

    // let checkedKeysRootOld: Set<string> = new Set();
    let {
      checkedKeysRoot, // 选中行的key
      checkedRowsCurrent, // 当前数据中选中的行
      halfCheckedKeys, // 半选中行的key
      expandedTreeRowIds, // 展开行的id
      checkedRows, // 所有选中的行
      // treeNodeProps,

      addCheckedKey,
      addParentsChecked,
      addSelfAndChildrenChecked,

      removeRowChildren,
      selectAll,
      selectNone,
      selectRow,
      unSelectRow,
      getSelectionInfo,
      expandTreeRow,
      expandAll,
      expandNone
    } = useBsTableTree(props, flattenTableRows, tableId, toRef(props, 'childrenKey'), tableId, getRowDataHash);

    // 数据是否为树状
    let isTreeData = ref(false);
    // 关联父级选择框
    let linkParentCheckbox = function () {
      // console.log('linkParentCheckbox 111');
      let checkedKeys = checkedKeysRoot.value;
      if (props.selectionConfig.checkStrictly) {
        checkedKeys.forEach((checkedKey: string) => {
          addCheckedKey(checkedKey);
        });
        return;
      }
      // console.log('linkParentCheckbox 222', checkedKeys);
      // 已经处理过的节点的key
      let processedKes: Record<string, any> = {};
      checkedKeys.forEach((checkedKey: string) => {
        if (checkedKey in processedKes) {
          return;
        }
        // console.log('linkParentCheckbox 333');
        processedKes[checkedKey] = 1;
        addSelfAndChildrenChecked(checkedKey);
        addParentsChecked(checkedKey);
      });
    };

    // TODO 列合并、行合并功能是否应该提取到当前组件计算
    let isInited = false;
    watch(() => [...props.data], function (data, oldData) {
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
        // console.log('isTreeDataFlag', isTreeDataFlag, defaultExpandAllRows, newFlattenTableRowData);
        isTreeData.value = isTreeDataFlag;
        flattenTableRows.value = newFlattenTableRowData;

        let { reserveSelectedRowKeys, type } = props.selectionConfig || {};
        let selectedRowKeys = props.selectedRowKeys;
        // 判断当数据被删除时是否仍然保留选项的key
        if (!reserveSelectedRowKeys) {
          if (type == 'checkbox') {
            // 如果在 selectionConfig.onSelectChange 事件中同步了 props.selectedRowKeys ，那么它和selectionConfig.reserveSelectedRowKeys=true的效果一样
            checkedKeysRoot.value = new Set(selectedRowKeys || []);
          } else {
            checkedKeysRoot.value = new Set((selectedRowKeys || []).slice(0, 1));
          }
          halfCheckedKeys.value = new Set();
          checkedRows.value = new Map();
        } else {
          let checkedKeysRootRaw = checkedKeysRoot.value;
          // checkedKeysRootOld = checkedKeysRootRaw;

          let arr = [...(selectedRowKeys || []), ...Array.from(checkedKeysRootRaw)];
          if (type == 'checkbox') {
            checkedKeysRoot.value = new Set(arr);
          } else {
            checkedKeysRoot.value = new Set(arr.slice(0, 1));
          }
        }
        // 清空上一份数据中已选择的行
        checkedRowsCurrent.value = new Map();

        clearCachedNodeInfo(tableId);

        // 展开需要展开的行
        if (needExpandRows.length > 0) {
          console.log('展开需要展开的行：', needExpandRows);
          needExpandRows.forEach(rowItem => {
            expandTreeRow(rowItem.node, rowItem.uid, defaultExpandAllRows, true);
          });
        }

        // 展开默认需要展开的行
        expandDefaultExpandedRows();
        linkParentCheckbox();
        isInited = true;
        // 执行完展开行、选中行后再渲染，防止数据更新后（如新增行、删除行）表格出现宽高抖动问题
        flattenTableRows2.value = newFlattenTableRowData;
      });
    }, { immediate: true });

    let watchCheckedKeysTimer: number;
    watch(() => [...(props.selectedRowKeys || [])], function (checkedKeys) {
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
          checkedKeysRoot.value = new Set([...checkedKeys, ...Array.from(checkedKeysRoot.value)]);
        }

        if (checkedKeys.length == 0) {
          halfCheckedKeys.value = new Set();
          return;
        }
        linkParentCheckbox();
      }, 0);
    }, { immediate: false });

    watch(() => (props.selectionConfig || {}), function (selectionConfig) {
      let { type, columnWidth } = selectionConfig;
      hasSelectionColumn.value = type == 'checkbox' || type == 'radio';
      selectionColumnWidth.value = columnWidth || 50;
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
              expandTreeRow(parentItem.node, parentItem.uid, false, true);
            });
            // 再展开自己
            if (!row.treeDataRowExpand) {
              expandTreeRow(row.node, rowKey, false, true);
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
      let hasResizeableColumn = columns.some(column => {
        return !!column.resizeable;
      });
      // 有固定列、有拖拽列宽功能时必须要设置colgroup
      if (!needColGroup && !isFixedHeaderRaw && !hasResizeableColumn) {
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
      if (notNeedColGroup && !isFixedHeaderRaw && !hasResizeableColumn) {
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
        if (props.selectionConfig?.type == 'radio') {
          checkedRows.value.clear();
          checkedRowsCurrent.value.clear();
          checkedKeysRoot.value.clear();
          addCheckedKey(nodeValue);

          let onSelectChange = props.selectionConfig?.onSelectChange;
          if (isFunction(onSelectChange)) {
            let selectionInfo = getSelectionInfo();
            onSelectChange({
              row: nodeData,
              isSelected: true,
              operateType: 'selectSingle',
              isHalfSelected: false,
              ...selectionInfo
            });
          }
          return;
        }
        selectRow(nodeValue, nodeData);
      },
      // 移除选中项
      removeCheckedKey (nodeValue: string, nodeData: Record<string, any>, hasChildren: boolean) {
        if (props.selectionConfig?.type == 'radio') {
          // console.log('removeCheckedKey radio');
          return;
        }
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
      flattenTableRows2,
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
      checkedRowsCurrent,
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
      unSelectRow,
      expandAll,
      expandNone
    };
  }
});
</script>
