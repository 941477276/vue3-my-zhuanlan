<template>
  <div
    class="bs-select"
    :class="{
      'is-disabled': disabled,
      'is-focus': isFocus,
      'is-multiple': multiple
    }"
    :data-bs-id="selectId"
    @click="onSelectRootClick">
    <bs-input
      ref="bsInputRef"
      :disabled="disabled"
      :readonly="bsInputReadonly"
      :clearable="clearable"
      :id="selectId"
      :name="name"
      :size="size"
      :placeholder="placeholder"
      :ariaLabel="ariaLabel">
      <template #suffix>
        <bs-icon name="chevron-down"></bs-icon>
      </template>
    </bs-input>
    <teleport to="body" v-if="dropdownDisplayed">
      <ul
        v-show="dropdownVisible"
        ref="bsSelectDropdownRef"
        class="bs-select-dropdown"
        :class="{'is-multiple': multiple}"
        :data-for-bs-select="selectId">
        <slot></slot>
      </ul>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref
} from 'vue';
import { BsSize } from '@/ts-tokens/bootstrap';
import { getSelectCount } from '@/common/globalData';

export default defineComponent({
  name: 'BsSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: { // 是否支持多选
      type: Boolean,
      default: false
    },
    clearable: { // 是否可以清空内容
      type: Boolean,
      default: false
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
    placeholder: {
      type: String,
      default: '请选择'
    },
    name: { // input原生的name属性
      type: String,
      default: ''
    },
    ariaLabel: { // area-label属性值
      type: String,
      default: ''
    }
  },
  setup (props: any, ctx: any) {
    let bsInputRef = ref<HTMLInputElement|null>(null);
    let bsSelectDropdownRef = ref<HTMLInputElement|null>(null);
    let bsInputReadonly = ref(true);
    let isFocus = ref(false);
    let selectId = ref(props.id || `bs-select_${getSelectCount()}`);
    let dropdownDisplayed = ref(false); // 下来菜单是否已经渲染
    let dropdownVisible = ref(false); // 下来菜单是否显示

    let dropdownShow = function () {
      let doShow = function () {
      //
      };
      if (!dropdownDisplayed.value) {
        dropdownDisplayed.value = true;
      }
    };
    let onSelectRootClick = function () {
      if (!props.disabled) {
        isFocus.value = true;
      }
      // if () {}
    };
    return {
      bsInputRef,
      bsSelectDropdownRef,
      bsInputReadonly,
      isFocus,
      selectId,
      dropdownDisplayed,
      dropdownVisible,

      onSelectRootClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-select";
</style>
