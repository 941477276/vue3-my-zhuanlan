<template>
  <div
    class="bs-date-time-editor"
    :class="[
      {
        'is-focus': visible
      },
      size ? `bs-date-time-editor-${size}` : ''
    ]">
    <BsOnlyChild>
      <slot name="trigger">
        <BsInput
          ref="bsInputRef"
          :model-value="inputModelValue"
          :disabled="disabled"
          :id="bsCommonPickerId"
          :size="size"
          :suffix-icon="suffixIcon"
          :clearable="clearable"
          :name="name"
          :placeholder="placeholder"
          :readonly="inputReadOnly"
          @input="onInput"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @click="showDropdown"
          @clear="$emit('clear')"
          @update:modelValue="$emit('update:inputModelValue', $event)">
          <slot name="suffix"></slot>
        </BsInput>
      </slot>
    </BsOnlyChild>
    <BsDropdownTransition
      :reference-ref="triggerRef"
      :try-all-placement="false"
      :set-min-width="setMinWidth"
      @before-enter="$emit('show')"
      @after-enter="$emit('shown')"
      @after-leave="$emit('hidden')">
      <div
        ref="bsPickerDropdownRef"
        v-if="display"
        v-show="visible"
        class="bs-picker-dropdown">
        <div class="bs-picker-panel-container">
          <slot></slot>
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
import BsInput from '../bs-input/BsInput.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import BsOnlyChild from '../bs-slot/BsOnlyChild.vue';
import { useForwardRef } from '@/hooks/useForwardRef';
import { useClickOutside } from '@/hooks/useClickOutside';
import { BsSize } from '@/ts-tokens/bootstrap';

let bsCommonPickerCount = 0;
export default defineComponent({
  name: 'BsCommonPicker',
  components: {
    BsInput,
    BsDropdownTransition,
    BsOnlyChild
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
    },
    name: { // input输入框的name属性
      type: String,
      default: null
    },
    inputModelValue: { // 输入框的值
      type: [String, Number],
      default: ''
    },
    suffixIcon: { // 后缀图标
      type: String,
      default: ''
    },
    clearable: { // 输入框是否可清空
      type: Boolean,
      default: true
    },
    setMinWidth: {
      type: Boolean,
      default: false
    },
    placeholder: { // 输入框提示文字
      type: String,
      default: ''
    },
    inputReadOnly: { // 设置输入框为只读（避免在移动设备上打开虚拟键盘）
      type: Boolean,
      default: false
    }
  },
  emits: ['update:inputModelValue', 'input', 'focus', 'blur', 'show', 'shown', 'hidden'],
  setup (props: any, ctx: any) {
    let bsInputRef = ref(null);
    let bsCommonPickerId = ref(props.id || `bs-common-picker_${++bsCommonPickerCount}`);

    // 触发元素
    let triggerRef = ref<HTMLElement|null>(null);
    useForwardRef(triggerRef);

    // 下拉元素
    let bsPickerDropdownRef = ref<HTMLElement|null>(null);
    let display = ref(false);
    let visible = ref(false);
    let showDropdown = function (flag = true) {
      if (props.disabled) {
        return;
      }
      if (typeof flag === 'boolean' && !flag) {
        visible.value = false;
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
      el?.addEventListener('click', function () {
        showDropdown();
      }, false);
    });
    // 点击区域外面隐藏下拉
    useClickOutside([triggerRef, bsPickerDropdownRef], function (flag: boolean) {
      if (flag) {
        visible.value = false;
      }
    });

    // 输入框输入事件
    let onInput = function (value: string, evt: Event) {
      ctx.emit('input', value, evt);
    };
    let onInputFocus = function (evt: Event) {
      ctx.emit('focus', evt);
    };
    let onInputBlur = function (evt: Event) {
      ctx.emit('blur', evt);
    };

    // 设置输入框校验状态
    let setValidateStatus = function (status: string) {
      (bsInputRef.value as any)?.setValidateStatus(status);
    };

    return {
      bsPickerDropdownRef,
      bsInputRef,
      display,
      visible,
      triggerRef,
      bsCommonPickerId,

      onInput,
      onInputBlur,
      onInputFocus,

      setValidateStatus,
      showDropdown,
      focus () {
        (bsInputRef.value as any)?.focus();
      },
      blur () {
        (bsInputRef.value as any)?.blur();
      }
    };
  }
});
</script>

<style lang="scss">
@import "bs-common-picker";
</style>
