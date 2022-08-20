<template>
<div class="bs-picker-year-panel">
  <PanelHeader
    v-if="showHeader"
    :onSuperPrev="onSuperPrev"
    :onSuperNext="onSuperNext">
    <button
      type="button"
      tabindex="-1"
      class="bs-picker-header-year-btn">{{ yearNumberInfo.startYear }}-{{ yearNumberInfo.endYear }}</button>
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

let defaultFormat = 'YYYY';
let yearDecadeCount = 10;
let panelYearCount = 12;
export default defineComponent({
  name: 'BsYearPanel',
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
    let yearValueNow = dayjs().format(defaultFormat);
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

    // 年份信息
    let yearNumberInfo = computed(function () {
      let currentYear = dayjsUtil.getYear(panelViewDate.value);
      let startYear = Math.floor(currentYear / yearDecadeCount) * yearDecadeCount;
      let endYear = startYear + yearDecadeCount - 1;

      return {
        currentYear,
        startYear,
        endYear
      };
    });

    let tableBody = computed(function () {
      let yearArr: any = [];
      let { currentYear, startYear, endYear } = yearNumberInfo.value;
      let baseYearDate = dayjs((startYear - 1) + '', 'YYYY');
      console.log('year', currentYear, startYear, endYear, baseYearDate);
      let tempYearArr = [];
      let disabledDate = props.disabledDate;
      while (tempYearArr.length < panelYearCount) {
        let date = dayjsUtil.addYear(baseYearDate, tempYearArr.length);
        let yearName = dayjsUtil.locale.format(date, 'zh-cn', 'YYYY');
        tempYearArr.push({
          yearName,
          dayjsIns: date,
          disabled: typeof disabledDate === 'function' ? !!disabledDate(date) : false
        });
      }

      while (tempYearArr.length > 0) {
        yearArr.push(tempYearArr.splice(0, 3));
      }

      return yearArr;
    });

    // 单元格点击事件
    let onCellClick = function (cellData: any) {
      let modelValue = props.modelValue;
      if (cellData.disabled) {
        return;
      }
      // 选择的是已经选中的日期则不进行后续操作
      if (modelValue && (modelValue.year() === cellData.dayjsIns.year())) {
        return;
      }
      ctx.emit('update:modelValue', cellData.dayjsIns);
    };

    let dateRender = props.dateRender;
    return {
      yearNumberInfo,
      tableBody,
      // 设置单元格的classname
      setCellClassname (cellData: any, cellIndex: number) {
        let modelValue = props.modelValue;
        let dayjsIns = cellData.dayjsIns;
        let classnames: string[] = [];
        let { startYear, endYear } = yearNumberInfo.value;
        let yearNumber = dayjsIns.year();
        // console.log('getCellClassname', cellData.disabled);
        if (modelValue && (modelValue.year() === yearNumber)) {
          classnames.push('is-selected');
        }
        if (yearNumber >= startYear && yearNumber <= endYear) {
          classnames.push('active-cell');
        }
        if (yearNumber === yearValueNow) {
          classnames.push('is-this-year');
        }
        if (cellData.disabled) {
          classnames.push('is-disabled');
        }
        return classnames;
      },
      setCellNode: props.dateRender ? (cellData: any) => {
        console.log('setCellNode', cellData);
        return dateRender(cellData.current, now, cellData.cellIndex);
      } : undefined,
      setCellText (cellData: any) {
        return cellData.yearName;
      },
      setCellTitle (cellData: any) {
        return cellData.yearName;
      },
      onSuperPrev () {
        console.log('onSuperPrev');
        setPanelViewDate(dayjsUtil.addYear(panelViewDate.value, -10));
      },
      onSuperNext () {
        console.log('onSuperPrev');
        setPanelViewDate(dayjsUtil.addYear(panelViewDate.value, 10));
      },
      onCellClick
    };
  }
});
</script>

<style lang="scss">
.bs-picker-year-panel{
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
