<template>
  <div class="bs-table-header">
    <table
      class="table"
      :class="{
        'table-sm': size == 'sm'
      }"
      :style="{
        tableLayout: 'fixed',
        width: width > 0 ? (width + 'px') : ''
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
        :columns="columns"
        :table-slots="tableSlots"></BsTableHead>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  SetupContext
} from 'vue';
import BsTableHead from './BsTableHead.vue';
import { BsTableColumn, BsTableSize } from '../bs-table-types';

export default defineComponent({
  name: 'BsTableFixedHeader',
  components: {
    BsTableHead
  },
  props: {
    width: [String, Number],
    colgroup: {
      type: Array as PropType<{ width: number; minWidth: number }[]>,
      default () {
        return [];
      }
    },
    size: {
      type: String as PropType<BsTableSize>
    },
    columns: { // 表格列
      type: Array as PropType<BsTableColumn[]>,
      default () {
        return [];
      }
    },
    tableSlots: {
      type: Object
    }
  },
  setup (props: any, ctx: SetupContext) {

  }
});
</script>
