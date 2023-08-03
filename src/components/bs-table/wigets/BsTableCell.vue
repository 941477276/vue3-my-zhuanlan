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
      <BsTableCustomContent
        :row-index="rowIndex"
        :cell-index="cellIndex"
        :row-data="rowData"
        :label="cellContent"
        :table-slots="tableSlots"
        :default-content="$slots.default"
        :slot-name="slotName || column.prop">
      </BsTableCustomContent>
    </div>
    <BsTableCustomContent
      v-else
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
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, onUpdated, onMounted, inject } from 'vue';
import { BsTableCustomContent } from './BsTableCustomContent';
import { BsTableColumnInner, bsTableCtxKey } from '../bs-table-types';
import { bsTableCellProps } from './bs-table-cell-props';
import { isFunction } from '@vue/shared';
import BsSpinner from '../../../components/bs-spinner/BsSpinner.vue';
import { BsiChevronRight } from 'vue3-bootstrap-icon/es/icons/BsiChevronRight';

export default defineComponent({
  name: 'BsTableCell',
  components: {
    BsiChevronRight,
    BsSpinner,
    BsTableCustomContent
  },
  props: {
    ...bsTableCellProps,
    tag: {
      type: String,
      default: 'td'
    },
    cellIndex: {
      type: Number
    },
    isHeaderCell: {
      type: Boolean
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
    },
    slotName: { // 自定义内容插槽名称
      type: String
    }
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
