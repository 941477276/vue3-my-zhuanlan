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
    <div class="bs-picker-panel has-panel-sidebar">
      <PanelSidebar></PanelSidebar>
      <BsDatePanel></BsDatePanel>
    </div>
    <template #footer v-if="showFooter">
      <slot name="footer">
        <div class="bs-picker-btns">
          <!--<BsButton class="bs-picker-clear" size="sm" @click="clear">清空</BsButton>
          <BsButton class="bs-picker-now" type="primary" size="sm" @click="setNow">此刻</BsButton>-->
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
  PropType, ref
} from 'vue';
import { BsSize } from '@/ts-tokens/bootstrap';
import BsCommonPicker from '../bs-common-picker/BsCommonPicker.vue';
import BsDatePanel from './panels/bs-date-panel/BsDatePanel.vue';
import PanelSidebar from './panels/panel-sidebar/PanelSidebar.vue';
import dayjs from 'dayjs';

// js编写日历思路：https://www.cnblogs.com/zaijin-yang/p/12009727.html
export default defineComponent({
  name: 'BsDatePicker',
  components: {
    BsCommonPicker,
    BsDatePanel,
    PanelSidebar
  },
  props: {
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
  setup (props: any, ctx: any) {
    let visible = ref(false);
    let viewDateText = ref('');
    console.log('今天是周几：', dayjs(new Date('2022/07/01')).day());
    return {
      visible,
      viewDateText
    };
  }
});
</script>

<style lang="scss">

</style>
