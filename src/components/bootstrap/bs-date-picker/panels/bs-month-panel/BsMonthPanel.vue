<template>
<div class="bs-picker-month-panel">
  <PanelHeader
    v-if="showHeader"
    :onSuperPrev="onSuperPrev"
    :onSuperNext="onSuperNext">
    <button
      type="button"
      tabindex="-1"
      class="bs-picker-header-year-btn">{{ yearName }}</button>
  </PanelHeader>
  <PanelBody
    :show-header="false"
    :body-cells="tableBody"
    :get-cell-text="setCellText"
    :get-cell-classname="setCellClassname"
    :get-cell-title="setCellTitle"
    :get-cell-node="setCellNode"
    @cell-click="onCellClick"></PanelBody>
</div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, PropType, ref, watch
} from 'vue';
import PanelHeader from '../panel-header/PanelHeader.vue';
import PanelBody from '../panel-body/PanelBody.vue';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil, getMonthDays } from '@/common/dayjsUtil';

let defaultFormat = 'YYYY-MM';
export default defineComponent({
  name: 'BsMonthPanel',
  components: {
    PanelHeader,
    PanelBody
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
    }
  },
  emits: ['update:modelValue'],
  setup (props: any, ctx: any) {
    let now = dayjs();
    let monthValueNow = dayjs().format(defaultFormat);
    let panelViewDate = ref(dayjs(props.modelValue ? props.modelValue : undefined));
    let setPanelViewDate = (date: Dayjs) => {
      if (!date) {
        return;
      }
      panelViewDate.value = date;
    };
    watch(() => props.modelValue, function (modelValue) {
      setPanelViewDate(modelValue || dayjs());
    });

    let yearName = computed(function () {
      let lang = 'zh-cn';
      return dayjsUtil.locale.format(panelViewDate.value, lang, 'YYYY年');
    });

    let tableBody = computed(function () {
      let monthArr: any = [];
      let currentMonth = dayjsUtil.setDate(panelViewDate.value, 1);
      console.log('currentMonth', currentMonth);
      let monthsShort = dayjsUtil.locale.monthsShort('zh-cn');
      let disabledDate = props.disabledDate;
      let tempMonthArr = monthsShort.map((monthName: string, index: number) => {
        let date = dayjsUtil.setMonth(currentMonth, index);
        return {
          monthName,
          date,
          disabled: typeof disabledDate === 'function' ? !!disabledDate(date, monthName) : false
        };
      });

      while (tempMonthArr.length > 0) {
        monthArr.push(tempMonthArr.splice(0, 3));
      }

      return monthArr;
    });

    // 单元格点击事件
    let onCellClick = function (cellData: any) {
      let modelValue = props.modelValue;
      if (cellData.disabled) {
        return;
      }
      // 选择的是已经选中的日期则不进行后续操作
      if (modelValue && (modelValue.format(defaultFormat) === cellData.date.format(defaultFormat))) {
        return;
      }
      ctx.emit('update:modelValue', cellData.date);
    };

    console.log('2022-08', dayjs('2022-08', 'YYYY-MM'));
    let dateRender = props.dateRender;
    return {
      yearName,
      tableBody,
      // 设置单元格的classname
      setCellClassname (cellData: any, cellIndex: number) {
        let currentDate = panelViewDate.value;
        let modelValue = props.modelValue;
        let dayjsIns = cellData.date;
        let classnames: string[] = ['active-cell'];
        // console.log('getCellClassname', cellData.disabled);
        if (modelValue && (modelValue.format(defaultFormat) === dayjsIns.format(defaultFormat))) {
          classnames.push('is-selected');
        }
        if (dayjsIns.format(defaultFormat) === monthValueNow) {
          classnames.push('is-this-month');
        }
        if (cellData.disabled) {
          classnames.push('is-disabled');
        }
        return classnames;
      },
      setCellNode: props.dateRender ? (cellData: any) => {
        return dateRender(cellData.current, now, cellData.cellIndex);
      } : undefined,
      setCellText (cellData: any) {
        return cellData.monthName;
      },
      setCellTitle (cellData: any) {
        return cellData.monthName;
      },
      onSuperPrev () {
        console.log('onSuperPrev');
        setPanelViewDate(dayjsUtil.addYear(panelViewDate.value, -1));
      },
      onSuperNext () {
        console.log('onSuperPrev');
        setPanelViewDate(dayjsUtil.addYear(panelViewDate.value, 1));
      },
      onCellClick
    };
  }
});
</script>

<style lang="scss">
.bs-picker-month-panel{
  width: 17.5rem;
  .bs-picker-table{
    width: 100%;
    height: 16rem;
  }
  .bs-picker-cell{
    &::before{
      top: calc(0.25rem + 10%);
      bottom: calc(0.25rem + 10%);
    }
  }
  .bs-picker-cell-inner{
    width: 100%;
    height: 80%;
    &::before{
      display: inline-block;
      content: ' ';
      width: 0;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
