<template>
  <thead class="bs-table-thead">
    <tr>
      <template v-for="(cell, index) in headThs">
        <BsTableCell
          v-if="cell.prop != selectionCellKey"
          tag="th"
          :ref="(com) => setRef(cell.prop, com)"
          :row-index="0"
          :table-slots="tableSlots"
          :column="cell"
          :cell-index="index"
          :key="cell.prop"
          :is-header-cell="true"
          :cell-attrs="cell.cellAttrs"
          :class="{
            'bs-table-cell-scrollbar-prev-neighbor': tableBodyHasScroll && (tableBodyScrollWidth > 0) && (index == headThs.length - 1),
            'bs-table-expand-cell-head': cell.prop == 'bs_expand_column'
          }">
        </BsTableCell>

        <BsTableCell
          v-else
          tag="th"
          :ref="(com) => setRef(cell.prop, com)"
          :row-index="0"
          :table-slots="tableSlots"
          :column="cell"
          :cell-index="index"
          :key="cell.prop"
          :is-header-cell="true"
          :cell-attrs="cell.cellAttrs"
          class="bs-table-selection-cell-head">
          <template v-if="cell.prop == selectionCellKey && selection == 'checkbox'">
            <BsCheckbox
              :delive-context-to-form-item="false"></BsCheckbox>
            <BsTableCellContent
              v-if="!!tableSlots.headSelectionExtra"
              :row-index="0"
              :cell-index="index"
              :table-slots="tableSlots"
              :is-head-cell="true"
              :column="cell"
              slot-name="headSelectionExtra">
            </BsTableCellContent>
          </template>
        </BsTableCell>
      </template>

      <th
        v-if="tableBodyHasScroll && tableBodyScrollWidth > 0"
        class="bs-table-cell bs-table-cell-scrollbar"
        :class="{
          'bs-table-cell-fixed-right': hasFixedRightColumn
        }"
        :style="{
          width: (tableBodyHasScroll && tableBodyScrollWidth > 0) ? tableBodyScrollWidth + 'px' : '',
          position: hasFixedRightColumn ? 'sticky' : '',
          right: hasFixedRightColumn ? '0' : ''
        }"></th>
    </tr>
  </thead>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed, SetupContext, VNode, reactive,
  onMounted, onUpdated
} from 'vue';
import { isFunction } from '@vue/shared';
import { isNumber, isObject } from '../../../utils/bs-util';
import { BsTableColumnInner, bsSelectionColumnKey, BsTableSelectionType } from '../bs-table-types';
import BsTableCell from './BsTableCell.vue';
import BsCheckbox from '../../bs-checkbox/BsCheckbox.vue';
import { BsTableCellContent } from './BsTableCellContent';

export default defineComponent({
  name: 'BsTableHead',
  props: {
    columns: { // 表格列
      type: Array as PropType<BsTableColumnInner[]>,
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
    selection: { // 选择框的类型
      type: String as PropType<BsTableSelectionType>
    }
  },
  components: {
    BsTableCell,
    BsCheckbox,
    BsTableCellContent
  },
  setup (props: any, ctx: SetupContext) {
    let headThs = computed(function () {
      let ths: any[] = [];
      let currentColumnIndex = -1;
      let skipEndColumnIndex = -1; // 待跳过的单元格结束索引
      ;(props.columns || []).forEach((column: BsTableColumnInner, index: number) => {
        let {
          label,
          prop,
          colSpan,
          width,
          minWidth,
          fixed,
          fixedIndex,
          fixedLeftColumnCount,
          fixedRightColumnCount,
          headSlotName,
          customHeadCellAttrs
        } = column;
        // 跳过需要合并的单元格
        if (skipEndColumnIndex > -1 && index < skipEndColumnIndex) {
          return;
        }
        skipEndColumnIndex = -1;
        if (isFunction(colSpan)) {
          colSpan = colSpan(index, column);
        }
        // 计算需要合并的单元
        if (colSpan && isNumber(colSpan)) {
          colSpan = Math.floor(colSpan);
          if (colSpan > 0) {
            skipEndColumnIndex = index + colSpan;
          }
        }
        let cellAttrs: Record<string, any> = {};
        // 获取单元格属性
        if (isFunction(customHeadCellAttrs)) {
          cellAttrs = customHeadCellAttrs(index, column);
          if (!isObject(cellAttrs)) {
            cellAttrs = {};
          }
        }
        if (colSpan! > 0) {
          cellAttrs.colSpan = colSpan;
        }
        ths.push({
          label,
          prop,
          colSpan,
          width,
          minWidth,
          fixed,
          fixedIndex,
          fixedLeftColumnCount,
          fixedRightColumnCount,
          cellAttrs,
          headSlotName
        });
      });
      return ths;
    });

    // 是否有右侧固定列
    let hasFixedRightColumn = computed(function () {
      let headThsRaw = headThs.value;
      return headThsRaw.some(function (column) {
        return column.fixedRightColumnCount && column.fixedRightColumnCount > 0;
      });
    });

    let cellComponentRefs = reactive<Record<string, any>>({});
    let setRef = function (key: string, com: any) {
      // console.log('setRef', key, com);
      cellComponentRefs[key] = com;
    };

    onMounted(function () {
      // console.log('head组件mounted');
      setTimeout(function () {
        if (hasFixedRightColumn.value) { // 主动调用列组件的计算列样式函数，以防止固定列定位不正确
          for (let key in cellComponentRefs) {
            let cellComponent = cellComponentRefs[key];
            cellComponent.calcColumnStyle();
          }
        }
      }, 60);
    });

    return {
      headThs,
      hasFixedRightColumn,
      selectionCellKey: bsSelectionColumnKey,
      setRef
    };
  }
});
</script>
