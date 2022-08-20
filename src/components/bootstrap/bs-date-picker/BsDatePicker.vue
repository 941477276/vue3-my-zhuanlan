<template>
  <BsCommonPicker
    class="bs-date-editor"
    ref="bsCommonPicker"
    suffix-icon="calendar"
    :size="size"
    :show-footer="showFooter"
    :input-model-value="viewDateText"
    :delive-context-to-form-item="deliveContextToFormItem"
    :disabled="disabled"
    :id="pickerId"
    :name="name"
    :placeholder="inputPlaceholder"
    :input-readonly="inputReadOnly"
    @update:inputModelValue="viewDateText = $event"
    @input="onInput"
    @blur="onInputBlur"
    @clear="clear"
    @show="visible = true"
    @hidden="visible = false">
    <div
      class="bs-picker-panel"
      :class="{
        'has-panel-sidebar': showSidebar
      }">
      <PanelSidebar v-if="showSidebar"></PanelSidebar>
      <BsDatePanel
        v-if="pickerType == 'date'"
        :model-value="date"
        :date-render="dateRender"
        :disabled-date="disabledDate"
        @update:modelValue="onDatePanelModelValueChange"></BsDatePanel>
      <BsMonthPanel
        v-if="pickerType == 'month'"
        :model-value="date"
        :date-render="dateRender"
        :disabled-date="disabledDate"
        @update:modelValue="onDatePanelModelValueChange"></BsMonthPanel>
      <BsQuarterPanel
        v-if="pickerType == 'quarter'"
        :model-value="date"
        :date-render="dateRender"
        :disabled-date="disabledDate"
        @update:modelValue="onDatePanelModelValueChange"></BsQuarterPanel>
      <BsYearPanel
        v-if="pickerType == 'year'"
        :model-value="date"
        :date-render="dateRender"
        :disabled-date="disabledDate"
        @update:modelValue="onDatePanelModelValueChange"></BsYearPanel>
      <div class="bs-picker-footer" v-if="showFooter && pickerType == 'date'">
        <div class="bs-picker-btns">
          <!--<BsButton class="bs-picker-clear" size="sm" @click="clear">清空</BsButton>
          <BsButton class="bs-picker-now" type="primary" size="sm" @click="setNow">此刻</BsButton>-->
          <!--TODO 按钮的禁用问题-->
          <BsButton class="bs-picker-today" size="sm" :disabled="todayIsDisabled" @click="onNowBtnClick">今天</BsButton>
        </div>
      </div>
    </div>
    <template #trigger>
      <slot></slot>
    </template>
  </BsCommonPicker>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  Ref,
  watch,
  provide,
  computed
} from 'vue';
import { PickerType, datePickerCtx } from '@/ts-tokens/bootstrap/date-picker';
import BsCommonPicker from '../bs-common-picker/BsCommonPicker.vue';
import { bsDatePickerProps } from './bsDatePickerProps';
import BsDatePanel from './panels/bs-date-panel/BsDatePanel.vue';
import BsMonthPanel from './panels/bs-month-panel/BsMonthPanel.vue';
import BsQuarterPanel from './panels/bs-quarter-panel/BsQuarterPanel.vue';
import BsYearPanel from './panels/bs-year-panel/BsYearPanel.vue';
import PanelSidebar from './panels/panel-sidebar/PanelSidebar.vue';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil } from '@/common/dayjsUtil';

let pickerCounts: any = {
  date: 0,
  week: 0,
  month: 0,
  quarter: 0,
  year: 0
};
// js编写日历思路：https://www.cnblogs.com/zaijin-yang/p/12009727.html
export default defineComponent({
  name: 'BsDatePicker',
  components: {
    BsCommonPicker,
    BsDatePanel,
    BsMonthPanel,
    BsQuarterPanel,
    BsYearPanel,
    PanelSidebar
  },
  props: {
    ...bsDatePickerProps
  },
  setup (props: any, ctx: any) {
    let bsCommonPicker = ref();
    let pickerId = ref(props.id || `bs-${props.pickerType}-picker_${++pickerCounts[props.pickerType]}`);
    let visible = ref(false);
    let now = dayjs();

    // 格式模板
    let formatInner = computed(function () {
      let format = props.format;
      if (format) {
        return format;
      }
      let pickerType = props.pickerType;
      let formatMap: any = {
        date: 'YYYY-MM-DD',
        week: 'YYYY-wo',
        month: 'YYYY-MM',
        quarter: 'YYYY-[Q]Q',
        year: 'YYYY'
      };
      let formatValue = formatMap[pickerType];
      if (props.showTime) {
        formatValue += 'hh:mm:ss';
      }
      return formatValue;
    });

    let date = ref<Dayjs|null>();
    let viewDateText = ref('');
    let setViewDateTxt = function (modelValue: Dayjs|string) {
      if (!modelValue) {
        viewDateText.value = '';
        return;
      }
      if (typeof modelValue === 'string') {
        viewDateText.value = modelValue;
        return;
      }
      let format = formatInner.value;
      let dayjsIns;
      if (props.pickerType == 'quarter') {
        dayjsIns = dayjsUtil.parseQuarter(modelValue, formatInner.value);
      } else {
        dayjsIns = dayjsUtil.parseToDayjs(modelValue, formatInner.value);
      }
      if (!dayjsIns) {
        viewDateText.value = '';
        return;
      }
      console.log('setViewDateTxt dayjsIns', dayjsIns, format);
      viewDateText.value = dayjsIns.format(format);
    };
    watch(() => props.modelValue, function (modelValue: Dayjs|string) {
      if (!modelValue) {
        date.value = null;
      } else {
        let dayjsIns;
        if (props.pickerType == 'quarter') {
          dayjsIns = dayjsUtil.parseQuarter(modelValue, formatInner.value);
        } else {
          dayjsIns = dayjsUtil.parseToDayjs(modelValue, formatInner.value);
        }

        date.value = dayjsIns;
      }

      setViewDateTxt(modelValue);
    }, { immediate: true });

    // 输入框提示文字
    let inputPlaceholder = computed(function () {
      let placeholder = props.placeholder;
      if (placeholder) {
        return placeholder;
      }
      let picker = props.pickerType;
      let pickerText = '';
      switch (picker) {
        case 'date':
          pickerText = '日期';
          break;
        case 'week':
          pickerText = '周';
          break;
        case 'month':
          pickerText = '月份';
          break;
        case 'quarter':
          pickerText = '季度';
          break;
        case 'year':
          pickerText = '年份';
          break;
      }
      return '请选择' + pickerText;
    });

    // 今天是否被禁用
    let todayIsDisabled = computed(function () {
      let pickerType = props.pickerType;
      if (pickerType != 'date') {
        return true;
      }
      let disabledDate = props.disabledDate;
      if (typeof disabledDate !== 'function') {
        return false;
      }
      return !!disabledDate(now.clone());
    });

    // 设置值
    let setDate = function (date?: Dayjs) {
      if (!date) {
        ctx.emit('update:modelValue', '');
        return;
      }
      let valueFormat = props.valueFormat;
      ctx.emit('update:modelValue', !valueFormat ? date.clone() : date.format(valueFormat));
    };
    // 清空内容
    let clear = function () {
      setDate();
    };
    // 隐藏下拉面板
    let hide = function (delay = 0) {
      if (delay > 0) {
        let timer = setTimeout(function () {
          clearTimeout(timer);
          (bsCommonPicker.value as any)?.showDropdown(false);
        }, delay);
        return;
      }
      (bsCommonPicker.value as any)?.showDropdown(false);
    };
    // 显示下拉面板
    let show = function () {
      (bsCommonPicker.value as any)?.showDropdown(true);
    };
    // 设置今天
    let setNow = function () {
      setDate(now.clone());
    };

    //  日期控件model-value值改变事件
    let onDatePanelModelValueChange = function (newDate: Dayjs) {
      setDate(newDate);
      // 隐藏下拉面板
      hide(300);
    };

    // 开启输入与操作同步功能
    let isInputTextInvalid = false;
    // 输入框输入事件
    let onInput = function (value: string) {
      if (!value) {
        isInputTextInvalid = false;
        return;
      }
      let format = formatInner.value;
      if (props.pickerType == 'quarter') {
        let dayjsIns = dayjsUtil.parseQuarter(value, format);
        if (!dayjsIns) {
          return;
        }
        setDate(dayjsIns);
        isInputTextInvalid = true;
        return;
      }
      // 开启严格校验，如不开启严格校验，当遇到格式如HH:mm:ss，输入框初始值为11:03:20，用户想改成11:30:20，当用户选中“03”然后再输入“3”时值就改变了
      let dayjsIns = dayjsUtil.strictDayjs(value, format);
      console.log('onInput', value, dayjsIns.isValid(), dayjsIns);
      if (dayjsIns.isValid()) {
        /* let period = '';
        if (props.use12Hours) {
          period = dayjsIns.hour() > 12 ? 'pm' : 'am';
        }
        let result = getUpdateModelValue(props, null, period, {
          hour: dayjsIns.hour(),
          minute: dayjsIns.minute(),
          second: dayjsIns.second()
        });
        // console.log('即将更新的modelValue：', result);
        ctx.emit('update:modelValue', result); */
        setDate(dayjsIns);
        isInputTextInvalid = true;
      } else {
        isInputTextInvalid = false;
      }
    };
    let onInputBlur = function () {
      if (!isInputTextInvalid) {
        setViewDateTxt(props.modelValue);
      }
    };

    // 向子孙组件提供当前组件的上下问
    provide(datePickerCtx, { ctx });

    return {
      bsCommonPicker,
      pickerId,

      visible,
      viewDateText,
      date,
      inputPlaceholder,
      todayIsDisabled,

      clear,
      hide,
      show,
      setNow,

      onDatePanelModelValueChange,
      onNowBtnClick () {
        setNow();
        hide(300);
      },
      onInput,
      onInputBlur
    };
  }
});
</script>

<style lang="scss">
.bs-picker-today{
  margin: 0 auto;
  transition: color .3s;
  &:hover{
    color: var(--primary);
  }
}
</style>
