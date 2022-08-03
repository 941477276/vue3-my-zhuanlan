<template>
  <BsCommonPicker
    class="bs-time-editor"
    ref="bsCommonPicker"
    suffix-icon="clock"
    :size="size"
    :show-footer="showFooter"
    :input-model-value="viewDateText"
    :delive-context-to-form-item="deliveContextToFormItem"
    :disabled="disabled"
    :id="bsTimePickerId"
    :set-min-width="true"
    @update:inputModelValue="viewDateText = $event"
    @input="onInput"
    @blur="onInputBlur"
    @clear="clear"
    @show="visible = true"
    @hidden="visible = false">
    <div class="bs-picker-panel">
      <BsPickerTimePanel
        ref="bsPickerTimePanelRef"
        :model-value="viewDate"
        :format="format"
        :value-format="valueFormat"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :second-step="secondStep"
        :use12-hours="use12Hours"
        :parent-visible="visible"
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :disabled-seconds="disabledSeconds"
        :hide-disabled-options="hideDisabledOptions"
        @update:modelValue="onUpdateTimePanelModelValue"></BsPickerTimePanel>
    </div>
    <template #footer v-if="showFooter">
      <slot name="footer">
        <div class="bs-picker-btns">
          <BsButton class="bs-picker-clear" size="sm" @click="clear">清空</BsButton>
          <BsButton class="bs-picker-now" type="primary" size="sm" @click="setNow">此刻</BsButton>
        </div>
      </slot>
    </template>
    <template #trigger>
      <slot></slot>
    </template>
  </BsCommonPicker>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  PropType
} from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import BsPickerTimePanel from './widgets/BsPickerTimePanel.vue';
import BsButton from '../bs-button/BsButton.vue';
import BsCommonPicker from '../bs-common-picker/BsCommonPicker.vue';
import { bsPickerTimePanelProps } from './widgets/bs-picker-time-panel-props';
import { useTimePicker, getUpdateModelValue } from './useTimePicker';
import { BsSize, FormItemContext, formItemContextKey } from '@/ts-tokens/bootstrap';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';

dayjs.extend(customParseFormat);
let bsTimePickerCount = 0;
export default defineComponent({
  name: 'BsTimePicker',
  components: {
    BsPickerTimePanel,
    BsButton,
    BsCommonPicker
  },
  props: {
    ...bsPickerTimePanelProps,
    showFooter: { // 是否显示底部
      type: Boolean,
      default: false
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    deliveContextToFormItem: { // 是否向form-item组件传递上下文信息
      type: Boolean,
      default: true
    },
    size: { // 输入框大小
      type: String as PropType<BsSize>,
      default: ''
    },
    id: {
      type: String,
      default: '',
      validator (idVal: string) {
        if (typeof idVal !== 'string' || /^\d+/.test(idVal)) {
          console.warn('id必须为字符串类型，且不能以数字开头');
          return false;
        }
        return true;
      }
    }
  },
  emits: ['update:modelValue'],
  setup (props: any, ctx: any) {
    let bsPickerTimePanelRef = ref(null);
    let bsCommonPicker = ref(null);
    let visible = ref(false);
    let bsTimePickerId = ref(props.id || `bs-time-picker_${++bsTimePickerCount}`);

    let { formatInner } = useTimePicker(props);

    let viewDate = ref(props.modelValue);
    // 用于显示的文本
    let viewDateText = ref('');
    let getViewDateText = function () {
      let date = viewDate.value;
      let format = props.format;
      let dayIns: Dayjs;
      if (!date) {
        return '';
      }

      if (!format) {
        if (props.use12Hours) {
          format = 'h:mm:ss a';
        } else {
          format = 'HH:mm:ss';
        }
      }
      if (typeof date === 'string') {
        dayIns = dayjs(date, format);
      } else {
        dayIns = dayjs(date);
      }
      return dayIns.format(format);
    };
    watch(() => props.modelValue, function (modelValue) {
      viewDate.value = modelValue;
      viewDateText.value = getViewDateText();
    }, { immediate: true });

    // 开启输入与操作同步功能
    let isInputTextInvalid = false;
    // 输入框输入事件
    let onInput = function (value: string) {
      if (!value) {
        isInputTextInvalid = false;
        return;
      }
      // 开启严格校验，如不开启严格校验，当遇到格式如HH:mm:ss，输入框初始值为11:03:20，用户想改成11:30:20，当用户选中“03”然后再输入“3”时值就改变了
      let dayjsIns = dayjs(value, formatInner.value, true);
      // console.log('onInput', value, dayjsIns.isValid(), dayjsIns);
      if (dayjsIns.isValid()) {
        let period = '';
        if (props.use12Hours) {
          period = dayjsIns.hour() > 12 ? 'pm' : 'am';
        }
        let result = getUpdateModelValue(props, null, period, {
          hour: dayjsIns.hour(),
          minute: dayjsIns.minute(),
          second: dayjsIns.second()
        });
        // console.log('即将更新的modelValue：', result);
        ctx.emit('update:modelValue', result);
        isInputTextInvalid = true;
      } else {
        isInputTextInvalid = false;
      }
    };
    let onInputBlur = function () {
      if (!isInputTextInvalid) {
        viewDateText.value = getViewDateText();
      }
    };

    let clear = function () {
      ctx.emit('update:modelValue', '');
    };
    let setNow = function () {
      (bsPickerTimePanelRef.value as any)?.setNow();
      // 300毫秒后再隐藏下拉内容，为的是让用户看到选中的内容
      let timer = setTimeout(function () {
        clearTimeout(timer);
        (bsCommonPicker.value as any).showDropdown(false);
      }, 300);
    };

    // <bs-time-panel>组件值更新事件
    let onUpdateTimePanelModelValue = function (newValue: string|Dayjs) {
      // console.log('onUpdateTimePanelModelValue', newValue);
      viewDate.value = newValue;
      ctx.emit('update:modelValue', newValue);
      (bsCommonPicker.value as any).focus();
    };

    // 设置输入框校验状态
    let setValidateStatus = function (status: string) {
      (bsCommonPicker.value as any)?.setValidateStatus(status);
    };

    if (props.deliveContextToFormItem) {
      // 传递给<bs-form-item>组件的参数
      let deliverToFormItemCtx = {
        id: bsTimePickerId.value,
        setValidateStatus
      };
      // 如果当前组件处在<bs-form-item>组件中，则将setValidateStatus方法存储到<bs-form-item>组件中
      useDeliverContextToParent<FormItemContext>(formItemContextKey, deliverToFormItemCtx);
    }

    return {
      bsPickerTimePanelRef,
      bsCommonPicker,
      viewDate,
      viewDateText,
      visible,
      bsTimePickerId,

      onUpdateTimePanelModelValue,
      onInput,
      onInputBlur,

      clear,
      setNow,
      setValidateStatus
    };
  }
});
</script>

<style lang="scss">
@import "bs-time-picker";
</style>
