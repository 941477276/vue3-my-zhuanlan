import { Dayjs } from 'dayjs';
import { parents } from '../../../../utils/bs-util';
import { dayjsUtil } from '../../../../utils/dayjsUtil';
import { Ref, SetupContext } from 'vue';

interface UseDatePanelsEventsOptions {
  ctx: SetupContext;
  props: any;
  dateFormat: string;
  hoverEndIsBeforeStart: Ref<boolean>;

  startDate: Ref<Dayjs|null>;
  endDate: Ref<Dayjs|null>;
  hoverStartDate: Ref<Dayjs|null>;
  hoverEndDate: Ref<Dayjs|null>;
  isHover: Ref<boolean>;

  startDatePanelRef: Ref<any>;
  endDatePanelRef: Ref<any>;
  setPanelViewDate: (startViewDate?: Dayjs|Date|null, endViewDate?: Dayjs|Date|null) => any;
};

export function useDatePanelsEvents (options: UseDatePanelsEventsOptions) {
  let {
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
  } = options;
  // 日期面板单元格点击事件
  let onDateCellClick = function (cellData: any) {
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
    hoverEndIsBeforeStart.value = false;
  };
  // 鼠标移动事件
  let onPanelsWrapMousemove = function (evt: MouseEvent) {
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
      hoverEndIsBeforeStart.value = true;
    } else if (endDateRaw && dayjsIns.isAfter(endDateRaw, 'date')) {
      console.log('hover结束日期比选择的结束日期大');
      startDate.value = hoverStartDate.value;
      endDate.value = null;
      hoverEndIsBeforeStart.value = false;
    }
    hoverEndDate.value = dayjsIns;
  };
  // 面板模式切换事件
  let onPanelModeChange = function () {
    isHover.value = false;

    let [start, end] = props.modelValue;
    // 解决在hover过程中，用户切换了面板模式，面板模式切换完成后，再次点击日期变成了选中日期，而非重新选择日期问题
    startDate.value = start || null;
    endDate.value = end || null;
    if (hoverStartDate.value) {
      hoverStartDate.value = null;
    }
    if (hoverEndDate.value) {
      hoverEndDate.value = null;
    }
    console.log('面板模式切换事件');
  };
  // 面板显示的日期切换事件
  let onViewDateChange = function (viewDate: Dayjs, panelName: string) {
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
  };
  // 日期输入框输入事件
  let onDateInput = function (evt: InputEvent, inputName: string) {
    let value = (evt.target as HTMLInputElement).value;
    console.log('onDateInput', value, inputName);
    let startDateRaw = startDate.value;
    let endDateRaw = endDate.value;
    let newStartDate = startDateRaw;
    let newEndDate = endDateRaw;
    if (inputName == 'start') {
      let startDayjsIns = dayjsUtil.strictDayjs(value, dateFormat);
      if (startDayjsIns.isValid()) {
        newStartDate = startDayjsIns;
        if (startDateRaw) {
          newStartDate = startDayjsIns.hour(startDateRaw.hour()).minute(startDateRaw.minute()).second(startDateRaw.second()).millisecond(startDateRaw.millisecond());
        }
        if (!endDateRaw) {
          newEndDate = newStartDate.clone();
        }
        if (newStartDate.isAfter(newEndDate!)) {
          newEndDate = newEndDate!.date(newEndDate!.date() + 1);
        }
      }
    } else {
      let endDayjsIns = dayjsUtil.strictDayjs(value, dateFormat);
      console.log('endDayjsIns.isValid()', endDayjsIns.isValid());
      if (endDayjsIns.isValid()) {
        newEndDate = endDayjsIns;
        if (endDateRaw) {
          newEndDate = endDayjsIns.hour(endDateRaw.hour()).minute(endDateRaw.minute()).second(endDateRaw.second()).millisecond(endDateRaw.millisecond());
        }
        if (!startDateRaw) {
          startDateRaw = newEndDate.clone();
        }
        if (newEndDate.isBefore(newStartDate!)) {
          newStartDate = newStartDate!.date(newStartDate!.date() - 1);
        }
      }
    }
    console.log('onDateInput', 555, newStartDate, newEndDate, newStartDate != startDateRaw, newEndDate != endDateRaw);
    if (newStartDate && newEndDate && (newStartDate != startDateRaw || newEndDate != endDateRaw)) {
      console.log('onDateInput', 666);
      startDate.value = newStartDate;
      endDate.value = newEndDate;
      // hoverStartDate.value = newStartDate;
      // hoverEndDate.value = endDateRaw;
      ctx.emit('previewDatesChange', [newStartDate, newEndDate]);
      ctx.emit('update:modelValue', [newStartDate, newEndDate]);
    }
  };

  return {
    onDateInput,
    onDateCellClick,
    onPanelModeChange,
    onPanelsWrapMousemove,
    onViewDateChange
  };
}
