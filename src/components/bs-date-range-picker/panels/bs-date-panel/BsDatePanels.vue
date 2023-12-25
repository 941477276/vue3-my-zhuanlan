<template>
  <div class="bs-picker-date-range-panels">
    <div class="bs-picker-date-range-time-header">
      <input type="text" class="bs-picker-date-range-time-editor-input form-control form-control-sm" placeholder="开始日期" />
      <BsTimePicker
        :model-value="startDate"
        size="sm"
        placeholder="开始时间"></BsTimePicker>

      <span class="bs-picker-date-range-time-separator"></span>

      <input type="text" class="bs-picker-date-range-time-editor-input form-control form-control-sm" placeholder="结束日期" />
      <BsTimePicker
        :model-value="endDate"
        size="sm"
        placeholder="结束时间"></BsTimePicker>
    </div>
    <div
      class="bs-picker-date-range-panels-wrap"
      @mousemove="onPanelsWrapMousemove">
      <BsDatePanel
        ref="startDatePanelRef"
        :get-cell-classname="setCellClassname"
        @cell-click="onDateCellClick"></BsDatePanel>
      <BsDatePanel
        ref="endDatePanelRef"
        :get-cell-classname="setCellClassname"
        @cell-click="onDateCellClick"></BsDatePanel>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  watch,
  defineComponent,
  provide,
  PropType
} from 'vue';
import {
  NOOP
} from '@vue/shared';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil, isLeapYear, getMonthDays } from '../../../../utils/dayjsUtil';
import { parents } from '@/utils/bs-util';
import BsDatePanel from '../../../bs-date-picker/panels/bs-date-panel/BsDatePanel.vue';
import BsTimePicker from '../../../bs-time-picker/BsTimePicker.vue';

export default defineComponent({
  name: 'BsDatePanels',
  components: {
    BsDatePanel,
    BsTimePicker
  },
  props: {
    modelValue: {
      type: Array as PropType<Dayjs[]>,
      default () {
        return [];
      }
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
    },
    yearButtonDisabled: { // 是否禁用年份按钮
      type: Boolean,
      default: false
    },
    monthButtonDisabled: { // 是否禁用月份按钮
      type: Boolean,
      default: false
    },
    getRowClassname: { // 自定义表格行classname
      type: Function,
      default () {
        return () => [];
      }
    },
    onYearClick: { // 年份按钮点击事件
      type: Function,
      default () {
        return NOOP;
      }
    },
    onMonthClick: { // 月份按钮点击事件
      type: Function,
      default () {
        return NOOP;
      }
    }
  },
  emits: ['update:modelValue', 'viewDateChange'],
  setup (props: any, ctx: any) {
    let startDatePanelRef = ref();
    let endDatePanelRef = ref();
    // console.log('比较日期：', dayjsUtil.isBetween(dayjs(), dayjs('2023-11-18 00:00:00'), dayjs(), 'month'));
    let startDate = ref<Dayjs|null>();
    let endDate = ref<Dayjs|null>();

    let hoverStartDate = ref<Dayjs|null>();
    let hoverEndDate = ref<Dayjs|null>();
    // 鼠标移动时选择的结束日期是否比选中的开始日期要小
    let hoverEndIsBeforeStart = false;

    watch(() => props.modelValue, function (modelValue) {
      let [start, end] = modelValue;
      startDate.value = start || null;
      endDate.value = end || null;
    }, { immediate: true });

    // 日期选中数量
    let dateSelectedCount = 0;

    return {
      startDatePanelRef,
      endDatePanelRef,
      startDate,
      endDate,

      setPanelViewDate (startViewDate: Dayjs|null, endViewDate: Dayjs|null) {
        console.log('调用了setPanelViewDate');
        if (!startViewDate && !endViewDate) {
          return;
        }
        if (startViewDate && !endViewDate) {
          endViewDate = startViewDate.month(startViewDate.month() + 1);
        } else if (endViewDate && !startViewDate) {
          startViewDate = endViewDate.month(endViewDate.month() - 1);
        }
        if (startViewDate && endViewDate) {
          let startViewDateYear = startViewDate.year();
          let startViewDateMonth = startViewDate.month();
          let endViewDateYear = endViewDate.year();
          let sameYear = false;
          if (endViewDateYear < startViewDateYear) {
            endViewDate = endViewDate.year(startViewDateYear);
            sameYear = true;
          } else if (startViewDateYear == endViewDateYear) {
            sameYear = true;
          }
          if (sameYear && endViewDate.month() < startViewDateMonth) {
            endViewDate = endViewDate.month(startViewDateMonth + 1);
          }
        }
        (startDatePanelRef.value as any)?.setPanelViewDate(startViewDate);
        (endDatePanelRef.value as any)?.setPanelViewDate(endViewDate);
      },
      // 设置单元格classname
      setCellClassname (cellData: any, cellIndex: number, rowIndex: number, externalData: Record<string, any>) {
        // console.log('setCellClassname', cellData);
        let format = 'YYYY-MM-DD';
        let dayjsIns = cellData.dayjsIns;
        let currentDateFormatted = dayjsIns.format(format);
        let classnames = [];
        let startDateRaw = startDate.value;
        let endDateRaw = endDate.value;

        let yearMonthFormat = 'YYYY-MM';
        let currentYearMonth = dayjsIns.format(yearMonthFormat);
        // 判断日期是否在显示的面板月份中
        let dateIsInCurrentPanelViewMonth = currentYearMonth == cellData.yearMonth;

        if (startDateRaw?.format(format) == currentDateFormatted && dateIsInCurrentPanelViewMonth) {
          classnames.push('bs-picker-cell-range-start');
          if (!endDateRaw) {
            classnames.push('bs-picker-cell-range-start-single');
          }
        }
        if (endDateRaw?.format(format) == currentDateFormatted && dateIsInCurrentPanelViewMonth) {
          classnames.push('bs-picker-cell-range-end');
          if (!startDateRaw) {
            classnames.push('bs-picker-cell-range-end-single');
          }
        }
        // console.log('externalData', rowIndex, externalData);

        if (startDateRaw && endDateRaw) {
          // 日期在开始与结束日期之间且日期必须在当前显示的面板中
          if (dayjsUtil.isBetween(dayjsIns, startDateRaw, endDateRaw, 'date') && dateIsInCurrentPanelViewMonth) {
            // console.log(dayjsIns.format(format) + '在开始结束日期之间');
            classnames.push('bs-picker-cell-in-range');
          }
        }
        let hoverStartDateRaw = hoverStartDate.value;
        let hoverEndDateRaw = hoverEndDate.value;
        if (hoverStartDateRaw && hoverEndDateRaw) {
          let hoverStartEqualHoverEnd = hoverStartDateRaw.format(format) == hoverEndDateRaw.format(format);
          if (!hoverStartEqualHoverEnd && dayjsUtil.isBetween(dayjsIns, hoverStartDateRaw, hoverEndDateRaw, 'date', '(]') && dateIsInCurrentPanelViewMonth) {
            classnames.push('bs-picker-cell-range-hover');
          }
          if (!hoverStartEqualHoverEnd && hoverEndDateRaw.format(format) == currentDateFormatted && dateIsInCurrentPanelViewMonth) {
            classnames.push('bs-picker-cell-range-hover-end');
            if (hoverEndIsBeforeStart) {
              classnames.push('hover-end-is-before-hover-start');
            }
          }
        }
        // classnames.push('bs-picker-cell-range-hover');
        return classnames;
      },
      // 日期面板单元格点击事件
      onDateCellClick (cellData: any) {
        console.log('onStartDateCellClick', cellData);
        /* if (dateSelectedCount > 1) {
          dateSelectedCount = 0;
        } */
        let startDateRaw = startDate.value;
        let endDateRaw = endDate.value;

        let dayjsIns = cellData.dayjsIns;
        if (startDateRaw) {
          if (!endDateRaw) {
            console.log(111);
            endDate.value = dayjsIns;
            hoverStartDate.value = hoverEndDate.value = null;
          } else {
            console.log(222);
            startDate.value = hoverStartDate.value = dayjsIns;
            endDate.value = hoverEndDate.value = null;
          }
        } else {
          if (!endDateRaw) {
            startDate.value = hoverStartDate.value = dayjsIns;
            endDate.value = hoverEndDate.value = null;
            console.log(333);
          } else {
            // 当endDate有值，但startDate没有值，说明用户一开始框选的结束时间比开始时间要小，程序自动将开始时间变成了结束时间
            startDate.value = dayjsIns;
            hoverStartDate.value = hoverEndDate.value = null;
            console.log(444);
          }
        }
        hoverEndIsBeforeStart = false;
      },
      // 鼠标移动事件
      onPanelsWrapMousemove (evt: MouseEvent) {
        if (!hoverStartDate.value) {
          return;
        }
        let target = evt.target as HTMLElement;
        if (!target || target.nodeType != 1) {
          return;
        }
        // console.log('onPanelsWrapMousemove', evt.target);
        let parentTd = target.nodeName == 'TD' ? target : parents(target, 'bs-picker-cell');
        if (!parentTd) {
          return;
        }

        let rowIndex = (parentTd.dataset.rowIndex as any) * 1;
        let cellIndex = (parentTd.dataset.cellIndex as any) * 1;
        let panelRootEl = parents(target, 'bs-picker-date-panel');
        let panelRef = panelRootEl === startDatePanelRef.value.$el ? startDatePanelRef.value : endDatePanelRef.value;
        let cellData = panelRef.getCellData(rowIndex, cellIndex);

        if (!cellData || cellData.disabled) {
          return;
        }
        let dayjsIns = cellData.dayjsIns;
        let startDateRaw = startDate.value;
        let endDateRaw = endDate.value;

        if (startDateRaw && dayjsIns.isBefore(startDateRaw, 'date')) {
          console.log('hover结束日期比选择的开始日期小');
          endDate.value = startDateRaw;
          startDate.value = null;
          hoverEndIsBeforeStart = true;
        } else if (endDateRaw && dayjsIns.isAfter(endDateRaw, 'date')) {
          console.log('hover结束日期比选择的结束日期大');
          startDate.value = hoverStartDate.value;
          endDate.value = null;
          hoverEndIsBeforeStart = false;
        }
        hoverEndDate.value = dayjsIns;
      }
    };
  }
});
</script>
