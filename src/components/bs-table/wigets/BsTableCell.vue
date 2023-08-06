<template>
  <component
    :is="tag"
    ref="cellRef"
    v-bind="cellAttrs"
    class="bs-table-cell"
    :class="[
      {
        'bs-table-cell-fixed-left-last': columnFixedInfo.isFixedLeft && (column.fixedIndex + 1) === column.fixedLeftColumnCount,
        'bs-table-cell-fixed-left': columnFixedInfo.isFixedLeft,
        'bs-table-cell-fixed-right-first': columnFixedInfo.isFixedRight && column.fixedIndex === 0,
        'bs-table-cell-fixed-right': columnFixedInfo.isFixedRight
      },
      cellClasses
    ]"
    :style="columnStyle">
    <div class="bs-table-cell-content" v-if="!isHeaderCell">
      <template v-if="cellIndex == 0 && isTreeData">
        <span
          v-for="item in (treeLevel - 1)"
          :key="item"
          class="bs-table-row-indent"
          :class="[`row-indent-level-${treeLevel}`]"></span>
        <button
          v-if="hasChildren || (lazy && !rowData[isLeafKey] && !lazyDataSuccessful)"
          class="bs-table-row-expand-icon bs-table-tree-row-expand-icon"
          :class="{
            'bs-table-row-expand-icon-expanded': treeRowExpand
          }"
          :disabled="rowExpandLoading"
          tabindex="-1"
          @click="toggleRowExpand">
          <template v-if="!rowExpandLoading">
            <BsiChevronRight v-if="!(tableSlots?.expandCellIcon || tableSlots?.['expand-cell-icon'])"></BsiChevronRight>
            <BsTableCustomContent
              v-else
              :row-index="rowIndex"
              :cell-index="0"
              :row-data="rowData"
              label=""
              :table-slots="tableSlots"
              :parent-slots="$slots"
              slot-name="expandCellIcon">
            </BsTableCustomContent>
          </template>
          <bs-spinner v-else color-type="primary"></bs-spinner>
        </button>
        <div v-else class="bs-table-row-expand-placeholder"></div>
      </template>
      <BsTableCellContent
        :row-index="rowIndex"
        :cell-index="cellIndex"
        :row-data="rowData"
        :label="cellContent"
        :table-slots="tableSlots"
        :default-content="$slots.default"
        :column="column"
        :slot-name="slotName || column.prop">
      </BsTableCellContent>
    </div>
    <template v-else>
      <BsTableCustomContent
        :row-index="rowIndex"
        :cell-index="cellIndex"
        :label="column.label"
        :table-slots="tableSlots"
        :is-head-cell="true"
        :column="column"
        :default-content="$slots.default"
        :slot-name="slotName || column.headSlotName">
        <slot></slot>
      </BsTableCustomContent>
      <div
        v-if="cellIndex != colgroup.length - 1 && column.resizeable"
        class="bs-table-resize-handle"
        :class="{
          'bs-table-resize-handle-active': resizeBarActive
        }"
        @mousedown="handleResizeBarMousedown"></div>
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, onUpdated, onMounted, inject } from 'vue';
import { BsTableCustomContent } from './BsTableCustomContent';
import { BsColgroupItem, BsTableColumnInner, bsTableCtxKey } from '../bs-table-types';
import { bsTableCellProps } from './bs-table-cell-props';
import { isFunction } from '@vue/shared';
import BsTableCellContent from './BsTableCellContent';
import BsSpinner from '../../../components/bs-spinner/BsSpinner.vue';
import { BsiChevronRight } from 'vue3-bootstrap-icon/es/icons/BsiChevronRight';
import { useGlobalEvent } from '../../../hooks/useGlobalEvent';

export default defineComponent({
  name: 'BsTableCell',
  components: {
    BsiChevronRight,
    BsSpinner,
    BsTableCustomContent,
    BsTableCellContent
  },
  props: {
    ...bsTableCellProps
  },
  setup (props: any, ctx: any) {
    // 表格根节点上下文
    let tableRootCtx = inject(bsTableCtxKey)!;

    let cellRef = ref<HTMLTableCellElement>();
    let cellContent = computed(function () {
      let customCell = props.column.customCell;
      if (isFunction(customCell)) {
        return customCell;
      }
      return props.rowData[props.column.prop];
    });
    // 单元格class
    let cellClasses = computed(function () {
      let cellClassName = props.column.cellClassName;
      if (isFunction(cellClassName)) {
        cellClassName = cellClassName(props.rowData, props.cellIndex, props.rowIndex, props.column);
      }
      if (cellClassName) {
        return cellClassName;
      }
      return '';
    });

    // 列是否为固定列
    let columnFixedInfo = computed(function () {
      let fixed = props.column.fixed;
      let isFixedLeft = fixed === true || fixed === 'left';
      let isFixedRight = fixed == 'right';
      return {
        isFixedLeft,
        isFixedRight,
        isFixed: isFixedLeft || isFixedRight
      };
    });

    // 计算列的样式
    let calcColumnStyle = function () {
      // console.log('calcColumnStyle被调用了');
      let cellEl = cellRef.value;
      let left = '';
      let right = '';
      let { isFixedLeft, isFixedRight } = columnFixedInfo.value;
      if (!isFixedLeft && !isFixedRight) {
        if (cellEl) {
          cellEl.style.position = '';
          cellEl.style.left = '';
          cellEl.style.right = '';
        }
        return {};
      }
      if (cellEl) {
        let siblingsCells = [...(cellEl.parentElement?.children || [])];
        let cellElIndex = siblingsCells.findIndex(nodeItem => nodeItem === cellEl);
        if (isFixedLeft) {
          left = siblingsCells.slice(0, cellElIndex).reduce(function (result: number, siblingItem: HTMLTableCellElement) {
            result += siblingItem.offsetWidth;
            return result;
          }, 0) + 'px';
        } else if (isFixedRight) {
          // console.log('siblingsCells.slice(cellElIndex + 1)', siblingsCells.slice(cellElIndex + 1));
          right = siblingsCells.slice(cellElIndex + 1).reduce(function (result: number, siblingItem: HTMLTableCellElement) {
            result += siblingItem.offsetWidth;
            return result;
          }, 0) + 'px';
        }
        // console.log('right', right);
        cellEl.style.position = 'sticky';
        cellEl.style.left = left;
        cellEl.style.right = right;
      }

      return {
        position: 'sticky',
        left,
        right
      };
    };
    // 列的样式
    let columnStyle = ref<Record<string, any>>({});

    // 行是否正在展开
    let rowExpandLoading = ref(false);
    // 懒数据是否加载成功
    let lazyDataSuccessful = ref(false);

    // 处理拖拽列宽
    let resizeBarActive = ref(false);
    let handleResizeBarMousedown = function (evt: MouseEvent) {
      evt.preventDefault();
      resizeBarActive.value = true;
      let target = evt.target as HTMLElement;
      let clientX = evt.clientX;
      // let column = props.column;

      let newWidth = 0;
      let minWidth = 20;
      let cellIndex = props.cellIndex;
      let colgroup = props.colgroup!;
      let oldWidth = colgroup[cellIndex].width;
      let lastMouseMoveClientX: number|null = null;
      let direction = ''; // 拖拽方向
      let colgroupOldWidths = colgroup.map((col: BsColgroupItem, index: number) => {
        return col.width;
      });
      let mouseMoveEvt = function (moveEvt: MouseEvent) {
        let newClientX = moveEvt.clientX;
        let distance = newClientX - clientX;

        if (lastMouseMoveClientX === null) {
          direction = newClientX < clientX ? 'left' : 'right';
        } else {
          if (newClientX < lastMouseMoveClientX) {
            direction = 'left';
          } else if (newClientX > lastMouseMoveClientX) {
            direction = 'right';
          }
        }
        lastMouseMoveClientX = newClientX;

        let width = oldWidth + distance;
        if (width < minWidth) {
          width = minWidth;
          distance += minWidth - width;
        }
        newWidth = width;
        tableRootCtx.setColWidth(cellIndex, newWidth);

        console.log('direction:', direction, distance);
        let newColGroupWidth = props.colgroup!.reduce(function (result: number, item: BsColgroupItem) {
          result += item.width;
          return result;
        }, 0);
        // 当前列后面的列宽
        let rearColWidths = colgroupOldWidths.slice(cellIndex + 1);
        // console.log('鼠标移动的距离：', cellIndex, distance, width, oldWidth, props.tableWidth, newColGroupWidth, direction);
        if (distance < 0) {
          let avgDistance = Number((Math.abs(distance) / rearColWidths.length).toFixed(2));
          // console.log('rearColWidths', rearColWidths, avgDistance);
          // 如果列宽改变后总列宽小于表格宽度，那么需要将distance平均分配给当前列后面的所有列的宽度
          if (newColGroupWidth < props.tableWidth) {
            colgroupOldWidths.forEach((colWidth: number, index: number) => {
              if (index <= cellIndex) {
                return;
              }
              tableRootCtx.setColWidth(index, colWidth + avgDistance);
            });
          } else {
            if (direction == 'right') {
              let avgDistance = distance / rearColWidths.length;
              // console.log('rearColWidths222', rearColWidths, avgDistance);

              // 如果列宽改变后总列宽大于表格宽度，并且当前列后面的列宽大于之前的宽度，那么当前列后面的所有列的宽度需要减去distance的平均值
              colgroupOldWidths.forEach((colWidth: number, index: number) => {
                if (index <= cellIndex) {
                  return;
                }
                let newColWidth = colWidth - avgDistance;
                let oldColWidth = colgroupOldWidths[index];
                if (distance >= 0) { // 恢复原来的宽度
                  newColWidth = oldColWidth;
                }
                tableRootCtx.setColWidth(index, newColWidth);
              });
            }
          }
        }
      };
      let removeMouseMoveEvtFn = function () {
        console.log('removeMouseMoveEvtFn执行了');
        resizeBarActive.value = false;
        useGlobalEvent.removeEvent('document', 'mousemove', mouseMoveEvt);
        useGlobalEvent.removeEvent('document', 'mouseup', removeMouseMoveEvtFn);
        target.removeEventListener('mouseup', removeMouseMoveEvtFn, false);

      };
      useGlobalEvent.addEvent('document', 'mousemove', mouseMoveEvt);
      useGlobalEvent.addEvent('document', 'mouseup', removeMouseMoveEvtFn);
      target.addEventListener('mouseup', removeMouseMoveEvtFn, false);
    };

    onMounted(function () {
      // console.log('列组件mounted');
      // columnStyle.value = calcColumnStyle();
      calcColumnStyle();
    });

    onUpdated(function () {
      // console.log('table column updated!');
      calcColumnStyle();
      // columnStyle.value = calcColumnStyle();
    });

    return {
      cellRef,
      cellContent,
      cellClasses,
      columnFixedInfo,
      columnStyle,
      calcColumnStyle,
      rowExpandLoading,
      lazyDataSuccessful,
      resizeBarActive,
      handleResizeBarMousedown,
      toggleRowExpand () {
        let childrenKey = props.childrenKey;
        let children = props.rowData[childrenKey] || [];
        if (props.lazy && children.length == 0) {
          if (rowExpandLoading.value) {
            return;
          }
          rowExpandLoading.value = true;
          tableRootCtx.expandTreeRow(props.rowData, props.rowId, false, function (isLoadFailed?: boolean) {
            rowExpandLoading.value = false;
            lazyDataSuccessful.value = !isLoadFailed;
          });
          return;
        }
        tableRootCtx.expandTreeRow(props.rowData, props.rowId);
      }
    };
  }
});
</script>
