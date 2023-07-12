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
        :table-slots="tableSlots"
        :table-body-has-scroll="tableBodyHasScroll"
        :table-body-scroll-width="tableBodyScrollWidth"></BsTableHead>
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
import { BsTableColumn, BsTableSize, BsColgroupItem } from '../bs-table-types';

export default defineComponent({
  name: 'BsTableFixedHeader',
  components: {
    BsTableHead
  },
  props: {
    width: [String, Number],
    colgroup: {
      type: Array as PropType<BsColgroupItem[]>,
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
    },
    tableBodyHasScroll: {
      type: Boolean,
      default: false
    },
    tableBodyScrollWidth: {
      type: Number,
      default: 0
    }
  },
  setup (props: any, ctx: SetupContext) {

  }
});
</script>
