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
      <BsTableCellContent
        :row-index="rowIndex"
        :cell-index="cellIndex"
        :row-data="rowData"
        :label="cellContent"
        :table-slots="tableSlots"
        :slot-name="column.prop"></BsTableCellContent>
    </div>
    <BsTableCellContent
      v-else
      :row-index="rowIndex"
      :cell-index="cellIndex"
      :label="column.label"
      :table-slots="tableSlots"
      :is-head-cell="true"
      :column="column"
      :slot-name="column.headSlotName"></BsTableCellContent>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, onUpdated, onMounted } from 'vue';
import { BsTableCellContent } from './BsTableCellContent';
import { BsTableColumnInner } from '../bs-table-types';
import { isFunction } from '@vue/shared';

export default defineComponent({
  name: 'BsTableCell',
  components: {
    BsTableCellContent
  },
  props: {
    tag: {
      type: String,
      default: 'td'
    },
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
    isHeaderCell: {
      type: Boolean
    },
    tableSlots: {
      type: Object
    },
    column: { // 当前列配置
      type: Object as PropType<BsTableColumnInner>,
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
      console.log('calcColumnStyle被调用了');
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
          console.log('siblingsCells.slice(cellElIndex + 1)', siblingsCells.slice(cellElIndex + 1));
          right = siblingsCells.slice(cellElIndex + 1).reduce(function (result: number, siblingItem: HTMLTableCellElement) {
            result += siblingItem.offsetWidth;
            return result;
          }, 0) + 'px';
        }
        console.log('right', right);
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
    /* // 列的样式
    let columnStyle = computed(function () {
      let cellEl = cellRef.value;
      let left = '';
      let right = '';
      let { isFixedLeft, isFixedRight } = columnFixedInfo.value;
      if (!isFixedLeft && !isFixedRight) {
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
          console.log('siblingsCells.slice(cellElIndex + 1)', siblingsCells.slice(cellElIndex + 1));
          right = siblingsCells.slice(cellElIndex + 1).reduce(function (result: number, siblingItem: HTMLTableCellElement) {
            result += siblingItem.offsetWidth;
            return result;
          }, 0) + 'px';
        }
      }
      return {
        position: 'sticky',
        left,
        right
      };
    }); */

    onMounted(function () {
      console.log('列组件mounted');
      // columnStyle.value = calcColumnStyle();
      calcColumnStyle();
    });

    onUpdated(function () {
      console.log('table column updated!');
      calcColumnStyle();
      // columnStyle.value = calcColumnStyle();
    });

    return {
      cellRef,
      cellContent,
      cellClasses,
      columnFixedInfo,
      columnStyle,
      calcColumnStyle
    };
  }
});
</script>
