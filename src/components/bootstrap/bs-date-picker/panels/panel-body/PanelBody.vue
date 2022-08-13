<template>
  <div class="bs-picker-body">
    <table
      class="bs-picker-table"
      @click="onCellClick">
      <thead v-if="showHeader">
      <tr>
        <th
          v-for="th in headerCells"
          :key="th.text">{{ th.text }}</th>
      </tr>
      </thead>
      <tbody>
        <tr
          class="bs-picker-row"
          v-for="(cells, rowIndex) in bodyCells"
          :key="rowIndex">
          <td
            class="bs-picker-cell"
            v-for="(cellItem, cellIndex) in cells"
            :key="cellIndex"
            :title="getCellTitle(cellItem, cellIndex)"
            :data-row-index="rowIndex"
            :data-cell-index="cellIndex"
            :class="[
              ...getCellClassname(cellItem, cellIndex)
            ]">
            <!--<div class="bs-picker-cell-inner">{{ getCellText(cellItem, cellIndex) }}</div>-->
            <PickerCellInner
              :get-cell-node="getCellNode"
              :cell-data="cellItem"
              :cell-index="cellIndex">{{ getCellText(cellItem, cellIndex) }}</PickerCellInner>
          </td>
        </tr>
        <!--<tr class="bs-picker-row">
          <td class="bs-picker-cell cell-range-hover">
            <div class="bs-picker-cell-inner">1</div>
          </td>
          <td class="bs-picker-cell active-cell cell-range-hover"><div class="bs-picker-cell-inner">2</div></td>
          <td class="bs-picker-cell active-cell is-today cell-range-hover"><div class="bs-picker-cell-inner">3</div></td>
          <td class="bs-picker-cell active-cell is-selected">
            <div class="bs-picker-cell-inner">
              4
            </div>
          </td>
          <td class="bs-picker-cell"><div class="bs-picker-cell-inner">5</div></td>
          <td class="bs-picker-cell"><div class="bs-picker-cell-inner">6</div></td>
          <td class="bs-picker-cell active-cell is-disabled"><div class="bs-picker-cell-inner">7</div></td>
        </tr>-->
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import { util } from '@/common/util';
import PickerCellInner from './PickerCellInner.vue';
/**
 * 查找单元格数据
 * @param tableData 表格数据
 * @param rowIndex 行单索引
 * @param cellIndex 列的索引
 */
let findCellData = function (tableData: any[], rowIndex: number, cellIndex: number) {
  let row = tableData[rowIndex];
  let cell = row?.[cellIndex];
  return cell;
};

export default defineComponent({
  name: 'BsPanelBody',
  components: {
    PickerCellInner
  },
  props: {
    showHeader: { // 是否显示表头
      type: Boolean,
      default: true
    },
    headerCells: { // 表头内容
      type: Array,
      default () {
        return [];
      }
    },
    bodyCells: { // 表格单元格内容
      type: Array,
      default () {
        return [];
      }
    },
    getRowClassname: { // 自定义表格行classname
      type: Function,
      default () {
        return () => [];
      }
    },
    getCellText: { // 自定义单元格内容
      type: Function,
      default: null
    },
    getCellClassname: { // 自定义单元格classname
      type: Function,
      default () {
        return () => [];
      }
    },
    getCellTitle: { // 自定义单元格的title内容
      type: Function,
      default () {
        return () => '';
      }
    },
    getCellNode: { // 自定义单元格的渲染内容
      type: Function,
      default: null
    }
  },
  emits: ['cell-click'],
  setup (props: any, ctx: any) {
    // 单元格点击事件
    let onCellClick = function (evt: MouseEvent) {
      let target = evt.target as HTMLElement;

      let tdEl = target.nodeName === 'TD' ? target : util.parents(target, 'bs-picker-cell');
      // console.log('target', target, tdEl);
      if (!tdEl) {
        return;
      }
      let rowIndex = tdEl.dataset.rowIndex * 1;
      let cellIndex = tdEl.dataset.cellIndex * 1;
      let cellData = findCellData(props.bodyCells, rowIndex, cellIndex);
      console.log('cell-data', cellData, rowIndex, cellData);
      ctx.emit('cell-click', cellData, rowIndex, cellData);
    };
    return {
      onCellClick
    };
  }
});
</script>

<style lang="scss">
@import "panel-body";
</style>
