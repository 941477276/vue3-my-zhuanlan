<template>
  <div
    class="bs-date-editor bs-time-editor"
    :class="[
      {
        'is-focus': visible
      },
      size ? `bs-date-editor-${size}` : ''
    ]">
    <BsOnlyChild>
      <slot>
        <BsInput
          ref="bsInputRef"
          v-model="viewDateText"
          :disabled="disabled"
          :id="bsTimePickerId"
          :size="size"
          suffix-icon="clock"
          clearable
          @input="onInput"
          @blur="onInputBlur"
          @click="onInputClick"
          @clear="clear"></BsInput>
      </slot>
    </BsOnlyChild>
    <BsDropdownTransition
      :reference-ref="triggerRef"
      :try-all-placement="false"
      :set-min-width="true">
      <div
        ref="bsPickerDropdownRef"
        v-if="display"
        v-show="visible"
        class="bs-picker-dropdown">
        <div class="bs-picker-panel-container">
          <div class="bs-picker-panel">
            <BsPickerTimePanel
              ref="bsPickerTimePanelRef"
              :model-value="viewDate"
              :format="format"
              :value-format="valueFormat"
              :hour-step="hourStep"
              :minute-step="minuteStep"
              :second-step="secondStep"
              :use12-hour="use12Hours"
              :parent-visible="visible"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
              :disabled-seconds="disabledSeconds"
              :hide-disabled-options="hideDisabledOptions"
              @update:modelValue="onUpdateTimePanelModelValue"></BsPickerTimePanel>
            <div class="bs-picker-footer" v-if="showFooter">
              <slot name="footer">
                <div class="bs-picker-btns">
                  <BsButton class="bs-picker-clear" size="sm" @click="clear">清空</BsButton>
                  <BsButton class="bs-picker-now" type="primary" size="sm" @click="setNow">此刻</BsButton>
                </div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </BsDropdownTransition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  PropType
} from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import BsInput from '../bs-input/BsInput.vue';
import BsPickerTimePanel from './widgets/BsPickerTimePanel.vue';
import BsButton from '../bs-button/BsButton.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import BsOnlyChild from '../bs-slot/BsOnlyChild.vue';
import { bsPickerTimePanelProps } from './widgets/bs-picker-time-panel-props';
import { useForwardRef } from '@/hooks/useForwardRef';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useTimePicker, getUpdateModelValue } from './useTimePicker';
import { BsSize, FormItemContext, formItemContextKey } from '@/ts-tokens/bootstrap';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';

dayjs.extend(customParseFormat);
let bsTimePickerCount = 0;
export default defineComponent({
  name: 'BsTimePicker',
  components: {
    BsInput,
    BsPickerTimePanel,
    BsButton,
    BsDropdownTransition,
    BsOnlyChild
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
    let bsInputRef = ref(null);
    let bsTimePickerId = ref(props.id || `bs-time-picker_${++bsTimePickerCount}`);

    let { formatInner } = useTimePicker(props);

    let viewDate = ref(props.modelValue);
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
    // 用于显示的文本
    let viewDateText = ref('');

    watch(() => props.modelValue, function (modelValue) {
      viewDate.value = modelValue;
      viewDateText.value = getViewDateText();
    }, { immediate: true });

    // 触发元素
    let triggerRef = ref<HTMLElement|null>(null);
    useForwardRef(triggerRef);

    // 下拉元素
    let bsPickerDropdownRef = ref<HTMLElement|null>(null);
    let display = ref(false);
    let visible = ref(false);
    let onInputClick = function () {
      if (props.disabled) {
        return;
      }
      if (!display.value) {
        display.value = true;
        nextTick(function () {
          visible.value = true;
        });
      } else {
        visible.value = true;
      }
    };
    // 给触发元素绑定点击事件
    watch(() => triggerRef.value, function (el) {
      el?.addEventListener('click', onInputClick, false);
    });
    // 点击区域外面隐藏下拉
    useClickOutside([triggerRef, bsPickerDropdownRef], function (flag: boolean) {
      if (flag) {
        visible.value = false;
      }
    });

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
        visible.value = false;
      }, 300);
    };

    // <bs-time-panel>组件值更新事件
    let onUpdateTimePanelModelValue = function (newValue: string|Dayjs) {
      // console.log('onUpdateTimePanelModelValue', newValue);
      viewDate.value = newValue;
      ctx.emit('update:modelValue', newValue);
      (bsInputRef.value as any)?.focus();
    };

    // 设置输入框校验状态
    let setValidateStatus = function (status: string) {
      (bsInputRef.value as any)?.setValidateStatus(status);
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
      bsPickerDropdownRef,
      bsInputRef,
      viewDate,
      viewDateText,
      display,
      visible,
      triggerRef,
      bsTimePickerId,

      onUpdateTimePanelModelValue,
      onInputClick,
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
