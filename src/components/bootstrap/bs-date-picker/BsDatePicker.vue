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
    data-id="bsTimePickerId"
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
        @update:modelValue="onDatePanelModelValueChange"></BsDatePanel>
      <div class="bs-picker-footer" v-if="showFooter">
        <div class="bs-picker-btns">
          <!--<BsButton class="bs-picker-clear" size="sm" @click="clear">清空</BsButton>
          <BsButton class="bs-picker-now" type="primary" size="sm" @click="setNow">此刻</BsButton>-->
          <BsButton class="bs-picker-today" size="sm" @click="onNowBtnClick">今天</BsButton>
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
  watch
} from 'vue';
import { BsSize } from '@/ts-tokens/bootstrap';
import { PickerType } from '@/ts-tokens/bootstrap/date-picker';
import BsCommonPicker from '../bs-common-picker/BsCommonPicker.vue';
import BsDatePanel from './panels/bs-date-panel/BsDatePanel.vue';
import PanelSidebar from './panels/panel-sidebar/PanelSidebar.vue';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsUtil } from '@/common/dayjsUtil';

// js编写日历思路：https://www.cnblogs.com/zaijin-yang/p/12009727.html
export default defineComponent({
  name: 'BsDatePicker',
  components: {
    BsCommonPicker,
    BsDatePanel,
    PanelSidebar
  },
  props: {
    modelValue: {
      type: [String, Object],
      default: ''
    },
    pickerType: {
      type: String as PropType<PickerType>,
      default: 'date'
    },
    format: { // 日期显示的格式
      type: String,
      default: 'YYYY-MM-DD'
    },
    valueFormat: { // 绑定值的格式
      type: String,
      default: ''
    },
    showFooter: { // 是否显示底部
      type: Boolean,
      default: true
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
    showSidebar: { // 是否显示侧边栏
      type: Boolean,
      default: false
    },
    sidebarAlign: { // 侧边栏显示位置
      type: String,
      default: 'left'
    },
    shortcuts: { // 侧边栏快捷按钮
      type: Array,
      default () {
        return [];
      }
    }
  },
  setup (props: any, ctx: any) {
    let bsCommonPicker = ref();
    let visible = ref(false);

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
    let setNow = function () {
      let now = dayjs();
      let valueFormat = props.valueFormat;
      ctx.emit('update:modelValue', !valueFormat ? now : now.format(valueFormat));
    };

    //  日期控件model-value值改变事件
    let onDatePanelModelValueChange = function (newDate: Dayjs) {
      let valueFormat = props.valueFormat;
      ctx.emit('update:modelValue', !valueFormat ? newDate : newDate.format(valueFormat));
      // 隐藏下拉面板
      hide(300);
    };

    return {
      bsCommonPicker,

      visible,
      viewDateText,
      date,

      hide,
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
