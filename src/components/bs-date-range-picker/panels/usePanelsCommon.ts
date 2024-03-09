import { reactive, Ref, ref } from 'vue';
import { Dayjs, OpUnitType } from 'dayjs';
import { dayjsUtil } from '../../../utils/dayjsUtil';
import { isFunction } from '../../../utils/bs-util';

type PanelType = 'date' | 'week' | 'month' | 'year';
/* interface UsePanelsCommonOptions {
  props: any;
  startDatePanelRef?: Ref<any>;
  endDatePanelRef?: Ref<any>;
  startDate?: Ref<Dayjs|null>;
  endDate?: Ref<Dayjs|null>;
  hoverStartDate?: Ref<Dayjs|null>;
  hoverEndDate?: Ref<Dayjs|null>;
  // 鼠标移动时选择的结束日期是否比选中的开始日期要小
  hoverEndIsBeforeStart?: Ref<boolean>;
  isHover?: Ref<boolean>;
} */
const dateFormatMap: Record<PanelType, string> = {
  date: 'YYYY-MM-DD',
  week: '',
  month: 'YYYY-MM',
  year: 'YYYY'
};
// 日期比大小使用的单位
const dateCompareUtilMap: Record<PanelType, OpUnitType> = {
  date: 'date',
  week: 'week',
  month: 'month',
  year: 'year'
};
export function usePanelsCommon (panelType: PanelType, props: any) {
  let startDatePanelRef = ref();
  let endDatePanelRef = ref();
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

  let dateFormat = dateFormatMap[panelType];
  // 设置单元格classname
  let setCellClassname = function (cellData: any, cellIndex: number, rowIndex: number, externalData: Record<string, any>) {
    let dayjsIns = cellData.dayjsIns;
    let currentDateFormatted = dayjsIns.format(dateFormat);
    let classnames: string[] = [];
    let startDateRaw = startDate.value;
    let endDateRaw = endDate.value;

    let currentYear = dayjsIns.year();
    // 判断日期是否在显示的面板月份/年份中
    let dateIsInCurrentPanelViewMonth = false;
    switch (panelType) {
      case 'date':
        // let yearMonthFormat = 'YYYY-MM';
        let currentYearMonth = dayjsIns.format('YYYY-MM');
        dateIsInCurrentPanelViewMonth = currentYearMonth == cellData.yearMonth;
        break;
      case 'month':
        dateIsInCurrentPanelViewMonth = currentYear == cellData.year;
        break;
      case 'year':
        let decadeInfo = cellData.decade;
        dateIsInCurrentPanelViewMonth = (currentYear >= decadeInfo.startYear) && (currentYear <= decadeInfo.endYear);
        break;
    }

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

    let compareUtil = dateCompareUtilMap[panelType];
    if (startDateRaw && endDateRaw) {
      // 日期在开始与结束日期之间且日期必须在当前显示的面板中
      if (dayjsUtil.isBetween(dayjsIns, startDateRaw, endDateRaw, compareUtil) && dateIsInCurrentPanelViewMonth) {
        // console.log(dayjsIns.format(format) + '在开始结束日期之间');
        classnames.push('bs-picker-cell-in-range');
      }
    }
    let hoverStartDateRaw = hoverStartDate.value;
    let hoverEndDateRaw = hoverEndDate.value;
    if (hoverStartDateRaw && hoverEndDateRaw) {
      let hoverStartEqualHoverEnd = hoverStartDateRaw.format(dateFormat) == hoverEndDateRaw.format(dateFormat);
      // console.log('dayjsIns, hoverStartDateRaw, hoverEndDateRaw', dayjsIns, hoverStartDateRaw, hoverEndDateRaw, dayjsUtil.isBetween(dayjsIns, hoverStartDateRaw, hoverEndDateRaw, compareUtil, '(]'));
      if (!hoverStartEqualHoverEnd && dayjsUtil.isBetween(dayjsIns, hoverStartDateRaw, hoverEndDateRaw, compareUtil, '(]') && dateIsInCurrentPanelViewMonth) {
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
    return classnames;
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

  return {
    startDatePanelRef,
    endDatePanelRef,
    startDate,
    endDate,
    hoverStartDate,
    hoverEndDate,
    isHover,
    hoverEndIsBeforeStart,
    panelBodyExternalData,
    startDateInputValue,
    endDateInputValue,

    setCellClassname,
    resetSelectedDates
  };
}
