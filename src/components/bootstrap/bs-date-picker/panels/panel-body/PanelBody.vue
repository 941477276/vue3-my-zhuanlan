<template>
  <div class="bs-picker-body">
    <table class="bs-picker-table">
      <thead>
      <tr>
        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
        <th>日</th>
      </tr>
      </thead>
      <tbody>
        <tr class="bs-picker-row">
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
        </tr>
        <tr class="bs-picker-row">
          <td class="bs-picker-cell active-cell is-disabled">
            <div class="bs-picker-cell-inner">1</div>
          </td>
          <td class="bs-picker-cell active-cell is-disabled"><div class="bs-picker-cell-inner">2</div></td>
          <td class="bs-picker-cell in-range-cell"><div class="bs-picker-cell-inner">3</div></td>
          <td class="bs-picker-cell in-range-cell"><div class="bs-picker-cell-inner">4</div></td>
          <td class="bs-picker-cell in-range-cell"><div class="bs-picker-cell-inner">5</div></td>
          <td class="bs-picker-cell"><div class="bs-picker-cell-inner">6</div></td>
          <td class="bs-picker-cell"><div class="bs-picker-cell-inner">7</div></td>
        </tr>
        <tr class="bs-picker-row">
          <td class="bs-picker-cell active-cell is-disabled">
            <div class="bs-picker-cell-inner">1</div>
          </td>
          <td class="bs-picker-cell active-cell is-disabled"><div class="bs-picker-cell-inner">2</div></td>
          <td class="bs-picker-cell in-range-cell"><div class="bs-picker-cell-inner">3</div></td>
          <td class="bs-picker-cell in-range-cell"><div class="bs-picker-cell-inner">4</div></td>
          <td class="bs-picker-cell in-range-cell"><div class="bs-picker-cell-inner">5</div></td>
          <td class="bs-picker-cell"><div class="bs-picker-cell-inner">6</div></td>
          <td class="bs-picker-cell"><div class="bs-picker-cell-inner">7</div></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsPanelBody',
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
    }
  }
});
</script>

<style lang="scss">
@import "panel-body";
</style>
