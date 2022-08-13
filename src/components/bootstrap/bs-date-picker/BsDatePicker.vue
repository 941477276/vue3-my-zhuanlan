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
    dadta-input="onInput"
    dadta-blur="onInputBlur"
    dadta-clear="clear"
    @show="visible = true"
    @hidden="visible = false">
    <div
      class="bs-picker-panel"
      :class="{
        'has-panel-sidebar': showSidebar
      }">
      <PanelSidebar v-if="showSidebar"></PanelSidebar>
      <BsDatePanel
        :model-value="date"
        :date-render="dateRender"
        :disabled-date="disabledDate"
        @update:modelValue="onDatePanelModelValueChange"></BsDatePanel>
      <div class="bs-picker-footer" v-if="showFooter">
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

    let date = ref<Dayjs|null>();
    let viewDateText = ref('');
    watch(() => props.modelValue, function (modelValue: Dayjs|string) {
      if (!modelValue) {
        date.value = null;
        viewDateText.value = '';
        return;
      }
      let dayjsIns = dayjsUtil.parseToDayjs(modelValue, props.format);
      date.value = dayjsIns;
      viewDateText.value = dayjsIns.format(props.format);
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
      let valueFormat = props.valueFormat;
      ctx.emit('update:modelValue', !valueFormat ? now.clone() : now.format(valueFormat));
    };

    //  日期控件model-value值改变事件
    let onDatePanelModelValueChange = function (newDate: Dayjs) {
      let valueFormat = props.valueFormat;
      ctx.emit('update:modelValue', !valueFormat ? newDate : newDate.format(valueFormat));
      // 隐藏下拉面板
      hide(300);
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

      hide,
      show,
      setNow,

      onDatePanelModelValueChange,
      onNowBtnClick () {
        setNow();
        hide(300);
      }
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
