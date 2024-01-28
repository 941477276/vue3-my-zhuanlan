<template>
  <div class="bs-picker-date-range-panels">
    <div
      class="bs-picker-date-range-panels-wrap"
      @mousemove="onPanelsWrapMousemove">
      <BsDatePanelAssemble
        ref="startDatePanelRef"
        picker-type="month"
        :get-row-classname="getRowClassname"
        :get-cell-classname="setCellClassname"
        :has-prefix-column="hasPrefixColumn"
        :use-model-value="false"
        :disabled-date="disabledDate"
        :date-render="dateRender"
        :year-button-disabled="yearButtonDisabled"
        :month-button-disabled="monthButtonDisabled"
        :mode="mode"
        @update:modelValue="onDateCellClick"
        @panel-mode-change="onPanelModeChange"
        @view-date-change="onViewDateChange($event, 'start')"></BsDatePanelAssemble>
      <BsDatePanelAssemble
        ref="endDatePanelRef"
        picker-type="month"
        :get-row-classname="getRowClassname"
        :get-cell-classname="setCellClassname"
        :has-prefix-column="hasPrefixColumn"
        :use-model-value="false"
        :disabled-date="disabledDate"
        :date-render="dateRender"
        :year-button-disabled="yearButtonDisabled"
        :month-button-disabled="monthButtonDisabled"
        :mode="mode"
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
  PropType,
  SetupContext,
  reactive,
  nextTick
} from 'vue';
import {
  isFunction,
  NOOP
} from '@vue/shared';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil, isLeapYear, getMonthDays } from '../../../../utils/dayjsUtil';
// @ts-ignore
import BsDatePanelAssemble from '../BsDatePanelAssemble';
import { PickerType } from '../../bs-date-range-picker-types';
import { useMonthPanelsEvents } from './useMonthPanelsEvents';

const dateFormat = 'YYYY-MM';
export default defineComponent({
  name: 'BsMonthPanels',
  components: {
    BsDatePanelAssemble
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
    mode: { // 面板的状态
      type: String as PropType<PickerType>,
      default: ''
    },
    getRowClassname: { // 自定义表格行classname
      type: Function,
      default () {
        return () => [];
      }
    },
    getCellClassname: { // 自定义表格单元格classname
      type: Function,
      default () {
        return [];
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
    let startDate = ref<Dayjs|null>(null);
    let endDate = ref<Dayjs|null>(null);

    let hoverStartDate = ref<Dayjs|null>(null);
    let hoverEndDate = ref<Dayjs|null>(null);
    // 鼠标移动时选择的结束日期是否比选中的开始日期要小
    let hoverEndIsBeforeStart = ref(false);
    let isHover = ref(false);
    // 给<panel-body>组件的额外数据（主要用于更新单元格的样式）
    let panelBodyExternalData = reactive({
      count: 0
    });

    // 日期输入的值
    let startDateInputValue = ref('');
    let endDateInputValue = ref('');
    // 设置日期输入框的值
    /* let setDateInputValue = function () {
      let hoverStartDateRaw = hoverStartDate.value;
      let hoverEndDateRaw = hoverEndDate.value;

      let hoverStartDateFormatted = hoverStartDateRaw ? hoverStartDateRaw.format(dateFormat) : '';
      let hoverEndDateFormatted = hoverEndDateRaw ? hoverEndDateRaw.format(dateFormat) : '';

      if (hoverEndDateFormatted && hoverEndDateRaw) {
        if (!hoverEndIsBeforeStart.value) {
          startDateInputValue.value = hoverStartDateFormatted;
          endDateInputValue.value = hoverEndDateFormatted;
        } else {
          startDateInputValue.value = hoverEndDateFormatted;
          endDateInputValue.value = hoverStartDateFormatted;
        }
        return;
      }

      let startDateRaw = startDate.value;
      let endDateRaw = endDate.value;
      if (!hoverStartDateFormatted && startDateRaw) {
        hoverStartDateFormatted = startDateRaw.format(dateFormat);
      }
      if (!hoverEndDateFormatted && endDateRaw) {
        hoverEndDateFormatted = endDateRaw.format(dateFormat);
      }
      startDateInputValue.value = hoverStartDateFormatted;
      endDateInputValue.value = hoverEndDateFormatted;
    }; */

    watch(() => props.modelValue, function (modelValue) {
      let [start, end] = modelValue;
      console.log('watch datePanels modelValue: ', modelValue);
      startDate.value = start || null;
      endDate.value = end || null;

      nextTick(function () {
        let viewDateStart = start || (!start && !end ? dayjs() : null);
        console.log('111调用setPanelViewDate', start, end);
        setPanelViewDate(start, end);
      });
    }, { immediate: true });

    /* watch([startDate, endDate], function ([startDateRaw, endDateRaw]) {
      if (!isHover.value) {
        console.log('aaaa', startDateRaw, endDateRaw);
        // setDateInputValue();
      }
    }, { immediate: true, flush: 'post' }); */
    watch([hoverStartDate, hoverEndDate], function ([startDateRaw, endDateRaw]) {
      console.log('bbbb');

      // setDateInputValue();
      if (startDateRaw || endDateRaw) {
        console.log('bbb-1');
        let arr = !hoverEndIsBeforeStart.value ? [startDateRaw, endDateRaw] : [endDateRaw, startDateRaw];
        ctx.emit('previewDatesChange', arr);
      }
    });

    // 设置面版显示日期
    let setPanelViewDate = function (startViewDate?: Dayjs|Date|null, endViewDate?: Dayjs|Date|null) {
      console.log('调用了setPanelViewDate', startViewDate, endViewDate);
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
        console.log(1111);
        endViewDate = startViewDate.year(startViewDate.year() + 1);
      } else if (endViewDate && !startViewDate) {
        console.log(2222);
        startViewDate = endViewDate.year(endViewDate.year() - 1);
      }
      if (startViewDate && endViewDate) {
        let startViewDateYear = startViewDate.year();
        // let startViewDateMonth = startViewDate.month();
        let endViewDateYear = endViewDate.year();
        // let sameYear = false;
        console.log(3333, startViewDateYear, endViewDateYear);
        if (endViewDateYear <= startViewDateYear) {
          endViewDate = endViewDate.year(startViewDateYear + 1);
          // sameYear = true;
        }/*  else if (startViewDateYear == endViewDateYear) {
          sameYear = true;
        }
        if (sameYear && endViewDate.month() <= startViewDateMonth) {
          endViewDate = endViewDate.month(startViewDateMonth + 1);
        } */
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
      hoverEndIsBeforeStart.value = false;
    };

    let {
      onDateInput,
      onDateCellClick,
      onPanelModeChange,
      onPanelsWrapMousemove,
      onViewDateChange
    } = useMonthPanelsEvents({
      ctx,
      props,
      dateFormat,
      hoverEndIsBeforeStart,

      startDate,
      endDate,
      hoverStartDate,
      hoverEndDate,
      isHover,

      startDatePanelRef,
      endDatePanelRef,
      setPanelViewDate
    });

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
        // console.log('setCellClassname', cellData);
        let dayjsIns = cellData.dayjsIns;
        let currentDateFormatted = dayjsIns.format(dateFormat);
        let classnames: string[] = [];
        let startDateRaw = startDate.value;
        let endDateRaw = endDate.value;

        // let yearMonthFormat = 'YYYY-MM';
        // let currentYearMonth = dayjsIns.format(yearMonthFormat);
        let currentYear = dayjsIns.year();
        // 判断年份是否在显示的面板年份中
        let dateIsInCurrentPanelViewMonth = currentYear == cellData.year;

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
          if (dayjsUtil.isBetween(dayjsIns, startDateRaw, endDateRaw, 'month') && dateIsInCurrentPanelViewMonth) {
            // console.log(dayjsIns.format(format) + '在开始结束日期之间');
            classnames.push('bs-picker-cell-in-range');
          }
        }
        let hoverStartDateRaw = hoverStartDate.value;
        let hoverEndDateRaw = hoverEndDate.value;
        if (hoverStartDateRaw && hoverEndDateRaw) {
          let hoverStartEqualHoverEnd = hoverStartDateRaw.format(dateFormat) == hoverEndDateRaw.format(dateFormat);
          // console.log('dayjsIns, hoverStartDateRaw, hoverEndDateRaw', dayjsIns, hoverStartDateRaw, hoverEndDateRaw, dayjsUtil.isBetween(dayjsIns, hoverStartDateRaw, hoverEndDateRaw, 'date', '(]'));
          if (!hoverStartEqualHoverEnd && dayjsUtil.isBetween(dayjsIns, hoverStartDateRaw, hoverEndDateRaw, 'month', '(]') && dateIsInCurrentPanelViewMonth) {
            classnames.push('bs-picker-cell-range-hover');
          }
          if (!hoverStartEqualHoverEnd && hoverEndDateRaw.format(dateFormat) == currentDateFormatted && dateIsInCurrentPanelViewMonth) {
            classnames.push('bs-picker-cell-range-hover-end');
            if (hoverEndIsBeforeStart.value) {
              classnames.push('hover-end-is-before-hover-start');
            }
          }
        }
        let getCellClassname = props.getCellClassname;
        if (isFunction(getCellClassname)) {
          let classname = getCellClassname(cellData, cellIndex, rowIndex, externalData);
          if (!Array.isArray(classname)) {
            classnames.push(classname);
          } else {
            classnames.push(...classname);
          }
        }
        // classnames.push('bs-picker-cell-range-hover');
        // console.log('classnames', classnames);
        return classnames;
      },
      // 重置面板状态
      resetPanelMode (emitEvents: boolean) {
        console.log('调用了resetPanelMode');
        let startDatePanelCom = startDatePanelRef.value;
        let endDatePanelCom = endDatePanelRef.value;
        startDatePanelCom.setCurrentMode('month', null, emitEvents);
        endDatePanelCom.setCurrentMode('month', null, emitEvents);
        // 解决用户切换面板模式但并未切回与pickerType一致的面板就关闭了下拉弹窗，然后再次打开了弹出，此时面板中的月份显示不正确问题
        let timer = setTimeout(function () {
          clearTimeout(timer);
          let startPanelViewDate = startDatePanelCom.getPanelViewDate();
          let endPanelViewDate = endDatePanelCom.getPanelViewDate();
          if (!startPanelViewDate && !endPanelViewDate) {
            return;
          }
          let modelValue = props.modelValue;
          if (modelValue && modelValue.length > 0) { // 如果有值，优先使用值作为显示的面板日期
            let start = modelValue[0]/*  || dayjs() */;
            setPanelViewDate(start, modelValue[1]);
            return;
          }
          if (startPanelViewDate && !endPanelViewDate) {
            endPanelViewDate = startPanelViewDate.year(startPanelViewDate.year() + 1);
          } else if (endPanelViewDate && !startPanelViewDate) {
            startPanelViewDate = endPanelViewDate.year(endPanelViewDate.year() - 1);
          }

          console.log('resetPanelMode', startPanelViewDate, endPanelViewDate);
          let startYear = startPanelViewDate.year();
          let endYear = endPanelViewDate.year();
          let startMonth = startPanelViewDate.month();
          let endMonth = endPanelViewDate.month();

          if (endYear < startYear/*  || (endMonth <= startMonth) */) {
            endDatePanelCom.setPanelViewDate(startPanelViewDate.year(startYear + 1));
          }
        }, 0);
      },

      onDateInput,
      onDateCellClick,
      onPanelModeChange,
      onPanelsWrapMousemove,
      onViewDateChange
    };
  }
});
</script>
