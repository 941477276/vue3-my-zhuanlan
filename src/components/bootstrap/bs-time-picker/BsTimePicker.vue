<template>
  <div
    class="bs-date-editor"
    :class="{
      'is-focus': visible
    }">
    <BsOnlyChild>
      <slot>
        <BsInput
          ref="bsInputRef"
          :model-value="viewDateText"
          :disabled="disabled"
          suffix-icon="clock"
          clearable
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
              :use12-hour="use12Hour"
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
  nextTick
} from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import BsInput from '../bs-input/BsInput.vue';
import BsPickerTimePanel from './widgets/BsPickerTimePanel.vue';
import BsButton from '../bs-button/BsButton.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import BsOnlyChild from '../bs-slot/BsOnlyChild.vue';
import { bsPickerTimePanelProps } from './widgets/bs-picker-time-panel-props';
import { useForwardRef } from '@/hooks/useForwardRef';
import { useClickOutside } from '@/hooks/useClickOutside';

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
    }
  },
  emits: ['update:modelValue'],
  setup (props: any, ctx: any) {
    let bsPickerTimePanelRef = ref(null);
    let bsInputRef = ref(null);

    let viewDate = ref(props.modelValue);
    let onUpdateTimePanelModelValue = function (newValue: string|Dayjs) {
      console.log('onUpdateTimePanelModelValue', newValue);
      viewDate.value = newValue;
      ctx.emit('update:modelValue', newValue);
      (bsInputRef.value as any)?.focus();
    };
    let viewDateText = computed(function () {
      let date = viewDate.value;
      let format = props.format;
      let dayIns: Dayjs;
      if (!date) {
        return '';
      }

      if (!format) {
        if (props.use12Hour) {
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
    });

    watch(() => props.modelValue, function (modelValue) {
      viewDate.value = modelValue;
    });

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

    let clear = function () {
      ctx.emit('update:modelValue', '');
    };
    let setNow = function () {
      (bsPickerTimePanelRef.value as any)?.setNow();
      let timer = setTimeout(function () {
        clearTimeout(timer);
        visible.value = false;
      }, 300);
    };

    return {
      bsPickerTimePanelRef,
      bsPickerDropdownRef,
      bsInputRef,
      viewDate,
      viewDateText,
      display,
      visible,
      triggerRef,

      onUpdateTimePanelModelValue,
      onInputClick,
      clear,
      setNow
    };
  }
});
</script>

<style lang="scss">
@import "bs-time-picker";
</style>
