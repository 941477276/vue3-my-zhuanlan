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
    :dropdown-class-name="dropdownClassName"
    @update:inputModelValue="viewDateText = $event"
    @input="onInput"
    @blur="onInputBlur"
    @clear="clear"
    @show="onShow"
    @hidden="onHidden">
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
        :show-header="showHeader"
        @update:modelValue="onUpdateTimePanelModelValue"></BsPickerTimePanel>
      <div class="bs-picker-footer" v-if="showFooter">
        <div class="bs-picker-btns">
          <BsButton class="bs-picker-clear" size="sm" @click="clear">清空</BsButton>
          <BsButton class="bs-picker-now" type="primary" size="sm" @click="setNow">此刻</BsButton>
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
  ref,
  watch,
  PropType, nextTick, inject
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
import { dayjsUtil } from '@/common/dayjsUtil';
import { util } from '@/common/util';

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
    },
    dropdownClassName: { // 下拉弹窗的额外classname
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change', 'hidden', 'open'],
  setup (props: any, ctx: any) {
    let bsPickerTimePanelRef = ref(null);
    let bsCommonPicker = ref(null);
    let visible = ref(false);
    let bsTimePickerId = ref(props.id || `bs-time-picker_${++bsTimePickerCount}`);
    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);

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
      console.log('getViewDateText', date);

      if (!format) {
        if (props.use12Hours) {
          format = 'hh:mm:ss a';
        } else {
          format = 'HH:mm:ss';
        }
      }
      if (typeof date === 'string') {
        let upperCaseDate = date.toUpperCase();
        dayIns = dayjs(date, format);
        let hour = dayIns.hour();
        if (upperCaseDate.endsWith('PM') && hour < 12) {
          dayIns = dayIns.hour(hour + 12);
        }
        if (upperCaseDate.endsWith('AM') && hour > 12) {
          dayIns = dayIns.hour(hour - 12);
        }
      } else {
        dayIns = dayjs(date);
      }
      console.log('getViewDateText2', dayIns, dayjsUtil.locale.format(dayIns, 'en', format));

      return dayjsUtil.locale.format(dayIns, 'en', format);
    };
    watch(() => props.modelValue, function (modelValue) {
      viewDate.value = modelValue;
      viewDateText.value = getViewDateText();
    }, { immediate: true });

    /**
     * 调用当前<bs-form-item>父组件的方法
     * @param fnName 方法名称
     * @param args 参数
     */
    let callFormItem = function (fnName: string, ...args: any) {
      if (!props.deliveContextToFormItem) {
        return;
      }
      nextTick(function () {
        if (formItemContext) {
          (formItemContext as any)[fnName](...args);
        }
      });
    };

    // 开启输入与操作同步功能
    let isInputTextValid = true;
    // 输入框输入事件
    let onInput = function (value: string) {
      if (!value) {
        isInputTextValid = false;
        return;
      }
      let format = formatInner.value;
      let periods = '';
      let use12Hours = props.use12Hours;
      if (use12Hours) {
        let upperCaseValue = value.toUpperCase();
        if (upperCaseValue.endsWith('AM')) {
          value = value.replace(/AM/i, '').trim();
          periods = 'AM';
        }
        if (upperCaseValue.endsWith('PM')) {
          value = value.replace(/PM/i, '').trim();
          periods = 'PM';
        }
        if (periods) {
          format = format.replace(/[a|p]/ig, '').trim();
        }
      }
      // 开启严格校验，如不开启严格校验，当遇到格式如HH:mm:ss，输入框初始值为11:03:20，用户想改成11:30:20，当用户选中“03”然后再输入“3”时值就改变了
      // let dayjsIns = dayjs(value, format, true);
      console.log('format', format, value);
      let dayjsIns = dayjsUtil.strictDayjs(value, format);
      // console.log('onInput', value, dayjsIns.isValid(), dayjsIns);
      if (dayjsIns.isValid()) {
        /* let period = '';
        if (props.use12Hours) {
          period = dayjsIns.hour() > 12 ? 'pm' : 'am';
        } */
        let timeInfo = {
          hour: dayjsIns.hour(),
          minute: dayjsIns.minute(),
          second: dayjsIns.second()
        };
        let { disabledHours, disabledMinutes, disabledSeconds } = props;
        let result = getUpdateModelValue({
          valueFormat: props.valueFormat,
          use12Hours: props.use12Hours,
          period: periods,
          timeInfo,
          originDate: viewDate.value,
          disabledFns: {
            disabledHours,
            disabledMinutes,
            disabledSeconds
          }
        });

        /* if (util.isFunction(disabledHours)) {
          if (disabledHours(timeInfo.hour, use12Hours)) {
            result = result.hour
          }
        } */
        console.log('即将更新的modelValue：', result);
        ctx.emit('update:modelValue', result);
        ctx.emit('change', result);
        callFormItem('validate', 'change');
        // viewDateText.value = getViewDateText();
        isInputTextValid = true;
      } else {
        isInputTextValid = false;
      }
    };
    let onInputBlur = function () {
      // if (!isInputTextValid) {
      viewDateText.value = getViewDateText();
      // }
    };

    let clear = function () {
      ctx.emit('update:modelValue', '');
      ctx.emit('change', '');
      callFormItem('validate', 'change');
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
      ctx.emit('change', newValue);
      callFormItem('validate', 'change');
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
      onShow () {
        visible.value = true;
        ctx.emit('open');
      },
      onHidden () {
        visible.value = false;
        ctx.emit('hidden');
      },

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
