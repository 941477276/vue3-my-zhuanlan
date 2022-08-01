<template>
  <div class="bs-date-editor">
    <BsInput
      :model-value="viewDateText"
      suffix-icon="clock"
      clearable></BsInput>
    <div class="bs-picker-dropdown">
      <div class="bs-picker-panel-container">
        <div class="bs-picker-panel">
          <BsPickerTimePanel
            ref="bsPickerTimePanelRef"
            :model-value="viewDate"
            @update:modelValue="onUpdateTimePanelModelValue"></BsPickerTimePanel>
          <div class="bs-picker-footer">
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch
} from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import BsInput from '../bs-input/BsInput.vue';
import BsPickerTimePanel from './widgets/BsPickerTimePanel.vue';
import BsButton from '../bs-button/BsButton.vue';
import { bsPickerTimePanelProps } from './widgets/bs-picker-time-panel-props';

export default defineComponent({
  name: 'BsTimePicker',
  components: {
    BsInput,
    BsPickerTimePanel,
    BsButton
  },
  props: {
    ...bsPickerTimePanelProps,
    showFooter: { // 是否显示底部
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props: any, ctx: any) {
    let bsPickerTimePanelRef = ref(null);
    let viewDate = ref(props.modelValue);
    let onUpdateTimePanelModelValue = function (newValue: string|Dayjs) {
      console.log('onUpdateTimePanelModelValue', newValue);
      viewDate.value = newValue;
      ctx.emit('update:modelValue', newValue);
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

    let clear = function () {
      ctx.emit('update:modelValue', '');
    };
    let setNow = function () {
      // console.log('BsTimePicker setNow');
      (bsPickerTimePanelRef.value as any)?.setNow();
    };

    return {
      bsPickerTimePanelRef,
      viewDate,
      viewDateText,

      onUpdateTimePanelModelValue,
      clear,
      setNow
    };
  }
});
</script>

<style lang="scss">
@import "bs-time-picker";
</style>
