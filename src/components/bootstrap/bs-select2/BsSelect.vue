<template>
  <div
    ref="bsSelectRef"
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
  defineComponent, nextTick,
  PropType,
  ref,
  watch
} from 'vue';
import { BsSize } from '@/ts-tokens/bootstrap';
import { getSelectCount } from '@/common/globalData';
import { util } from '@/common/util';
import { useClickOutside } from '@/hooks/useClickOutside';

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
    let bsSelectRef = ref<HTMLElement|null>(null);
    let bsInputRef = ref<HTMLInputElement|null>(null);
    let bsSelectDropdownRef = ref<HTMLElement|null>(null);
    let bsInputReadonly = ref(true);
    let isFocus = ref(false);
    let selectId = ref(props.id || `bs-select_${getSelectCount()}`);
    let dropdownDisplayed = ref(false); // 下来菜单是否已经渲染
    let dropdownVisible = ref(false); // 下来菜单是否显示

    /**
     * 显示下拉菜单
     */
    let dropdownShow = function () {
      let doShow = function () {
        dropdownVisible.value = true;
        nextTick(function () {
          let bsSelectRect = (bsSelectRef.value as HTMLElement).getBoundingClientRect();
          let bsSelectOffset = util.offset(bsSelectRef.value as HTMLElement);
          let bsSelectDropdownEl = bsSelectDropdownRef.value as HTMLElement;
          let originOpacity = bsSelectDropdownEl.style.opacity;
          // bsSelectDropdownEl.style.opacity = '0';
          // let scrollTop = util.scrollTop();
          // let scrollLeft = util.scrollLeft();
          bsSelectDropdownEl.style.width = bsSelectRect.width + 'px';
          bsSelectDropdownEl.style.top = (bsSelectOffset.top + bsSelectRect.height) + 'px';
          bsSelectDropdownEl.style.left = (bsSelectOffset.left) + 'px';
        });
      };
      if (!dropdownDisplayed.value) {
        console.log('dropdownShow 1');
        dropdownDisplayed.value = true;
        let timer = setTimeout(function () {
          clearTimeout(timer);
          doShow();
        }, 0);
      } else {
        console.log('dropdownShow 2');
        doShow();
      }
    };
    /**
     * 隐藏下拉菜单
     */
    let dropdownHide = function () {
      dropdownVisible.value = false;
      isFocus.value = false;
    };

    let isClickOutside = useClickOutside([bsSelectRef, bsSelectDropdownRef]);
    watch(isClickOutside, (newVal: boolean) => {
      console.log('isClickOutside', isClickOutside.value);
      if (newVal) {
        dropdownHide();
      }
    });

    let onSelectRootClick = function () {
      if (props.disabled) {
        return;
      }
      isFocus.value = true;
      dropdownShow();
    };
    return {
      bsSelectRef,
      bsInputRef,
      bsSelectDropdownRef,
      bsInputReadonly,
      isFocus,
      selectId,
      dropdownDisplayed,
      dropdownVisible,

      onSelectRootClick,
      dropdownShow,
      dropdownHide
    };
  }
});
</script>

<style lang="scss">
@import "bs-select";
</style>
