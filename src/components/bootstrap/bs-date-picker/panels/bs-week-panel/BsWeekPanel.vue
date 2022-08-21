<template>
  <div class="bs-picker-week-panel">
    <BsDatePanel
      v-bind="$props"
      :has-prefix-column="true"
      :get-row-classname="setRowClassname"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)">
      <template #prefixColumn="cellData">
        <td class="bs-picker-cell bs-picker-week-cell">{{ getWeek(cellData.dayjsIns) }}</td>
      </template>
    </BsDatePanel>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  watch,
  defineComponent,
  PropType,
  provide,
  inject
} from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil } from '@/common/dayjsUtil';
import BsDatePanel from '../bs-date-panel/BsDatePanel.vue';

let defaultFormat = 'YYYY-wo';
export default defineComponent({
  name: 'BsWeekPanel',
  components: {
    BsDatePanel
  },
  props: {
    modelValue: {
      type: Object as PropType<Dayjs>,
      default: null
    },
    dateRender: { // 自定义日期单元格的内容
      type: Function,
      default: null
    },
    disabledDate: { // 禁用的日期
      type: Function,
      default: null
    },
    showHeader: { // 是否显头部
      type: Boolean,
      default: true
    },
    hasPrefixColumn: { // 是否有前置列
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props: any, ctx: any) {
    let getWeek = function (date: Dayjs) {
      return dayjsUtil.locale.getWeek(date, 'zh-cn');
    };
    return {
      getWeek,

      setRowClassname (rowCells: any[]) {
        let classnames: string[] = ['bs-picker-week-panel-row'];
        let modelValueWeek = props.modelValue ? props.modelValue.format(defaultFormat) : '';
        if (modelValueWeek) {
          let flag = rowCells.some((cellData: any) => cellData.dayjsIns.format(defaultFormat) === modelValueWeek);
          if (flag) {
            classnames.push('is-row-selected');
          }
        }
        let disabledDate = props.disabledDate;
        if (typeof disabledDate === 'function') {
          let flag = rowCells.some((cellData: any) => !!disabledDate(cellData.dayjsIns));
          if (flag) {
            classnames.push('is-row-disabled');
          }
        }
        return classnames;
      }
    };
  }
});
</script>

<style lang="scss">
.bs-picker-week-panel{
  .bs-picker-cell{
    &:hover{
      .bs-picker-cell-inner{
        background-color: transparent!important;
      }
    }
  }
}
.bs-picker-week-panel-row{
  transition: background-color .3s, color .3s;
  &:not(.is-row-disabled):not(.is-row-selected):hover{
    .bs-picker-cell{
      background-color: #f3f3f3;
    }
  }
  &.is-row-selected{
    .bs-picker-cell{
      color: #fff;
      background-color: var(--primary);
    }
  }
  &.is-row-disabled{
    .bs-picker-week-cell{
      cursor: default;
      pointer-events: none;
    }
  }
}
.bs-picker-week-cell{
  font-weight: bold;
  color: #aaa;
}
</style>
