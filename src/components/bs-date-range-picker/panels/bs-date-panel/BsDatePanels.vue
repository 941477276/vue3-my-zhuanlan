<template>
  <div class="bs-picker-date-range-panels">
    <div class="bs-picker-date-range-time-header">
      <input
        type="text"
        class="bs-picker-date-range-time-editor-input form-control form-control-sm"
        placeholder="开始日期"
        :value="startDateInputValue"
        />
      <BsTimePicker
        :model-value="startDate"
        :disabled="isHover"
        size="sm"
        placeholder="开始时间"></BsTimePicker>

      <span class="bs-picker-date-range-time-separator"></span>

      <input
        type="text"
        class="bs-picker-date-range-time-editor-input form-control form-control-sm"
        placeholder="结束日期"
        :value="endDateInputValue"
      />
      <BsTimePicker
        :model-value="endDate"
        :disabled="isHover"
        size="sm"
        placement="bottomEnd"
        placeholder="结束时间"></BsTimePicker>
    </div>
    <div
      class="bs-picker-date-range-panels-wrap"
      @mousemove="onPanelsWrapMousemove">
      <BsDatePanelAssemble
        ref="startDatePanelRef"
        picker-type="date"
        :get-cell-classname="setCellClassname"
        :use-model-value="false"
        @update:modelValue="onDateCellClick"
        @panel-mode-change="onPanelModeChange"
        @view-date-change="onViewDateChange($event, 'start')"></BsDatePanelAssemble>
      <BsDatePanelAssemble
        ref="endDatePanelRef"
        picker-type="date"
        :get-cell-classname="setCellClassname"
        :use-model-value="false"
        @update:modelValue="onDateCellClick"
        @panel-mode-change="onPanelModeChange"
        @view-date-change="onViewDateChange($event, 'end')"></BsDatePanelAssemble>
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
  PropType, reactive, nextTick
} from 'vue';
import {
  NOOP
} from '@vue/shared';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil, isLeapYear, getMonthDays } from '../../../../utils/dayjsUtil';
import { parents } from '@/utils/bs-util';
import BsDatePanel from '../../../bs-date-picker/panels/bs-date-panel/BsDatePanel.vue';
import BsTimePicker from '../../../bs-time-picker/BsTimePicker.vue';
// @ts-ignore
import BsDatePanelAssemble from '../BsDatePanelAssemble';

const dateFormat = 'YYYY-MM-DD';
export default defineComponent({
  name: 'BsDatePanels',
  components: {
    BsDatePanelAssemble,
    // BsDatePanel,
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
  emits: ['update:modelValue', 'viewDateChange', 'previewDatesChange'],
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
    let isHover = ref(false);
    // 给<panel-body>组件的额外数据（主要用于更新单元格的样式）
    let panelBodyExternalData = reactive({
      count: 0
    });

    watch(() => props.modelValue, function (modelValue) {
      let [start, end] = modelValue;
      console.log('watch datePanels modelValue: ', modelValue);
      startDate.value = start || null;
      endDate.value = end || null;

      nextTick(function () {
        let viewDateStart = start || dayjs();
        setPanelViewDate(viewDateStart, end);
      });
    }, { immediate: true });

    let startDateInputValue = ref('');
    let endDateInputValue = ref('');
    watch([startDate, endDate], function ([startDateRaw, endDateRaw]) {
      if (!isHover.value) {
        console.log('aaaa');
        startDateInputValue.value = startDateRaw ? startDateRaw.format(dateFormat) : '';
        endDateInputValue.value = endDateRaw ? endDateRaw.format(dateFormat) : '';
        panelBodyExternalData.count++;
      }
    });
    watch([hoverStartDate, hoverEndDate], function ([startDateRaw, endDateRaw]) {
      console.log('bbbb');
      panelBodyExternalData.count++;
      let hoverStartDateFormatted = startDateRaw ? startDateRaw.format(dateFormat) : '';
      let hoverEndDateFormatted = endDateRaw ? endDateRaw.format(dateFormat) : '';
      if (!hoverEndIsBeforeStart) {
        startDateInputValue.value = hoverStartDateFormatted;
        endDateInputValue.value = hoverEndDateFormatted;
      } else {
        startDateInputValue.value = hoverEndDateFormatted;
        endDateInputValue.value = hoverStartDateFormatted;
      }
      if (startDateRaw || endDateRaw) {
        let arr = !hoverEndIsBeforeStart ? [startDateRaw, endDateRaw] : [endDateRaw, startDateRaw];
        ctx.emit('previewDatesChange', arr);
      }
    });

    // 设置面版显示日期
    let setPanelViewDate = function (startViewDate?: Dayjs|Date|null, endViewDate?: Dayjs|Date|null) {
      console.log('调用了setPanelViewDate'/* , startViewDate, endViewDate */);
      if (!startViewDate && !endViewDate) {
        return;
      }
      if (startViewDate instanceof Date) {
        startViewDate = dayjs(startViewDate);
      }
      if (endViewDate instanceof Date) {
        endViewDate = dayjs(endViewDate);
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
        if (sameYear && endViewDate.month() <= startViewDateMonth) {
          endViewDate = endViewDate.month(startViewDateMonth + 1);
        }
      }
      (startDatePanelRef.value as any)?.setPanelViewDate(startViewDate);
      (endDatePanelRef.value as any)?.setPanelViewDate(endViewDate);
    };

    // 重置选中的日期
    let resetSelectedDates = function () {
      let [start, end] = props.modelValue;
      startDate.value = start || null;
      endDate.value = end || null;
      hoverStartDate.value = hoverEndDate.value = null;
      isHover.value = false;
      hoverEndIsBeforeStart = false;
    };
    return {
      startDatePanelRef,
      endDatePanelRef,
      startDate,
      endDate,

      startDateInputValue,
      endDateInputValue,
      isHover,
      panelBodyExternalData,

      resetSelectedDates,
      setPanelViewDate,
      // 设置单元格classname
      setCellClassname (cellData: any, cellIndex: number, rowIndex: number, externalData: Record<string, any>) {
        let dayjsIns = cellData.dayjsIns;
        let currentDateFormatted = dayjsIns.format(dateFormat);
        let classnames = [];
        let startDateRaw = startDate.value;
        let endDateRaw = endDate.value;

        let yearMonthFormat = 'YYYY-MM';
        let currentYearMonth = dayjsIns.format(yearMonthFormat);
        // 判断日期是否在显示的面板月份中
        let dateIsInCurrentPanelViewMonth = currentYearMonth == cellData.yearMonth;

        if (startDateRaw?.format(dateFormat) == currentDateFormatted && dateIsInCurrentPanelViewMonth) {
          classnames.push('bs-picker-cell-range-start');
          if (!endDateRaw) {
            classnames.push('bs-picker-cell-range-start-single');
          }
        }
        if (endDateRaw?.format(dateFormat) == currentDateFormatted && dateIsInCurrentPanelViewMonth) {
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
          let hoverStartEqualHoverEnd = hoverStartDateRaw.format(dateFormat) == hoverEndDateRaw.format(dateFormat);
          // console.log('dayjsIns, hoverStartDateRaw, hoverEndDateRaw', dayjsIns, hoverStartDateRaw, hoverEndDateRaw, dayjsUtil.isBetween(dayjsIns, hoverStartDateRaw, hoverEndDateRaw, 'date', '(]'));
          if (!hoverStartEqualHoverEnd && dayjsUtil.isBetween(dayjsIns, hoverStartDateRaw, hoverEndDateRaw, 'date', '(]') && dateIsInCurrentPanelViewMonth) {
            classnames.push('bs-picker-cell-range-hover');
          }
          if (!hoverStartEqualHoverEnd && hoverEndDateRaw.format(dateFormat) == currentDateFormatted && dateIsInCurrentPanelViewMonth) {
            classnames.push('bs-picker-cell-range-hover-end');
            if (hoverEndIsBeforeStart) {
              classnames.push('hover-end-is-before-hover-start');
            }
          }
        }
        // classnames.push('bs-picker-cell-range-hover');
        return classnames;
      },
      // 重置面板状态
      resetPanelMode () {
        startDatePanelRef.value.setCurrentMode('date');
        endDatePanelRef.value.setCurrentMode('date');
      },
      // 日期面板单元格点击事件
      onDateCellClick (cellData: any) {
        console.log('onStartDateCellClick', cellData);
        /* if (dateSelectedCount > 1) {
          dateSelectedCount = 0;
        } */
        let startDateRaw = startDate.value;
        let endDateRaw = endDate.value;
        let update = function (start: Dayjs, end: Dayjs) {
          ctx.emit('update:modelValue', [start, end]);
        };

        let dayjsIns = cellData;
        if (startDateRaw) {
          if (!endDateRaw) {
            console.log(111, startDate.value, endDate.value);
            hoverStartDate.value = hoverEndDate.value = null;
            endDate.value = dayjsIns;
            isHover.value = false;
            update(startDate.value!, endDate.value!);
          } else {
            console.log(222, startDate.value, endDate.value);
            startDate.value = hoverStartDate.value = dayjsIns;
            endDate.value = hoverEndDate.value = null;
          }
        } else {
          if (!endDateRaw) {
            startDate.value = hoverStartDate.value = dayjsIns;
            endDate.value = hoverEndDate.value = null;
            console.log(333, startDate.value, endDate.value);
          } else {
            hoverStartDate.value = hoverEndDate.value = null;
            // 当endDate有值，但startDate没有值，说明用户一开始框选的结束时间比开始时间要小，程序自动将开始时间变成了结束时间
            startDate.value = dayjsIns;
            isHover.value = false;
            update(startDate.value!, endDate.value!);
            console.log(444, startDate.value, endDate.value);
          }
        }
        hoverEndIsBeforeStart = false;
      },
      // 鼠标移动事件
      onPanelsWrapMousemove (evt: MouseEvent) {
        // console.log('onPanelsWrapMousemove 111', hoverStartDate.value);
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
        let panelRootEl = parents(target, 'bs-date-panel-assemble');
        let panelRef = panelRootEl === startDatePanelRef.value.$el ? startDatePanelRef.value : endDatePanelRef.value;
        let cellData = panelRef.getCellData(rowIndex, cellIndex);
        if (!cellData || cellData.disabled) {
          return;
        }
        isHover.value = true;
        let dayjsIns = cellData.dayjsIns;
        let startDateRaw = startDate.value;
        let endDateRaw = endDate.value;
        // console.log('onPanelsWrapMousemove 555', dayjsIns!.format(dateFormat));

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
      },
      // 面板模式切换事件
      onPanelModeChange () {
        isHover.value = false;

        let [start, end] = props.modelValue;
        // 解决在hover过程中，用户切换了面板模式，面板模式切换完成后，再次点击日期变成了选中日期，而非重新选择日期问题
        startDate.value = start || null;
        endDate.value = end || null;
        hoverStartDate.value = hoverEndDate.value = null;
        console.log('面板模式切换事件');
      },
      // 面板显示的日期切换事件
      onViewDateChange (viewDate: Dayjs, panelName: string) {
        isHover.value = false;

        let [start, end] = props.modelValue;
        // 解决在hover过程中，用户切换了面板模式，面板模式切换完成后，再次点击日期变成了选中日期，而非重新选择日期问题
        startDate.value = start || null;
        endDate.value = end || null;
        hoverStartDate.value = hoverEndDate.value = null;

        console.log('面板显示的日期切换事件', viewDate);
        let panelViewDateStart: Dayjs|null = null;
        let panelViewDateEnd: Dayjs|null = null;
        if (panelName == 'start') {
          panelViewDateEnd = endDatePanelRef.value.getPanelViewDate();
          if (viewDate.isAfter(panelViewDateEnd, 'month') || viewDate.isSame(panelViewDateEnd, 'month')) {
            setPanelViewDate(viewDate, viewDate.month(viewDate.month() + 1));
          }
        } else {
          panelViewDateStart = startDatePanelRef.value.getPanelViewDate();
          if (viewDate.isBefore(panelViewDateStart, 'month') || viewDate.isSame(panelViewDateStart, 'month')) {
            setPanelViewDate(viewDate.month(viewDate.month() - 1), viewDate);
          }
        }
      }
    };
  }
});
</script>
