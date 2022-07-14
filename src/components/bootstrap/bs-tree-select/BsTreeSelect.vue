<template>
  <div
    ref="bsTreeSelectRef"
    class="bs-tree-select"
    :class="[
      {
        'is-disabled': disabled,
        'is-focus': isFocus,
        // 'checkbox-hidden': multiple && !checkboxVisible,
        // 'radio-hidden': !multiple && !radioVisible
      },
      size ? `bs-select-${size}` :''
    ]"
    :data-bs-id="selectId"
    @click="onSelectRootClick">
    <bs-input
      ref="bsInputRef"
      :disabled="disabled || loading"
      :readonly="bsInputReadonly"
      :clearable="clearable"
      :id="selectId"
      :value="viewText"
      :size="size"
      :delive-context-to-form-item="false"
      :placeholder="loading ? loadingText : placeholder"
      :ariaLabel="ariaLabel"
      @clear="onInputClear">
      <template #suffix>
        <bs-icon name="chevron-down"></bs-icon>
      </template>
    </bs-input>
    <teleport :disabled="!teleported" :to="appendTo">
      <transition
        name="slide"
        @enter="onEnter">
        <div
          v-show="dropdownVisible"
          ref="=bsSelectDropdownRef"
          class="bs-tree-select-dropdown"
          :class="{
            'placement-on-top': dropdownDisplayDirection === 'top',
            'placement-on-bottom': dropdownDisplayDirection === 'bottom',
            'checkbox-hidden': multiple && !checkboxVisible,
            'radio-hidden': !multiple && !radioVisible
          }">
          <BsTree
            ref="treeRef"
            v-bind="treeProps"
            v-model:checked-keys="treeModelValue"
            :tree-data="treeData"
            :node-key="nodeKey"
            :empty-text="emptyText"
            :show-checkbox="multiple"
            :show-radio="!multiple"
            :check-strictly="checkStrictly"
            :check-on-click-node="checkOnClickNode"
            :expand-on-click-node="checkStrictly"></BsTree>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  PropType,
  ref,
  reactive,
  watch,
  provide,
  ComponentInternalInstance,
  computed,
  inject
} from 'vue';
import {
  BsSize,
  FormItemContext,
  ValidateStatus,
  formItemContextKey
} from '@/ts-tokens/bootstrap';
import { util } from '@/common/util';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import BsInput from '../bs-input/BsInput.vue';
import BsTree from '../bs-tree/BsTree.vue';
import { bsTreeSelectProps } from './props';

let treeSelectCount = 0;
export default defineComponent({
  name: 'BsTreeSelect',
  components: {
    BsInput,
    BsTree
  },
  props: {
    ...bsTreeSelectProps
  },
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let bsTreeSelectRef = ref<HTMLElement|null>(null);
    let bsInputRef = ref<ComponentInternalInstance|null>(null);
    let bsSelectDropdownRef = ref<HTMLElement|null>(null);
    let bsInputReadonly = ref(true);
    let isFocus = ref(false);
    let selectId = ref(props.id || `bs-tree-select_${++treeSelectCount}`);
    let dropdownDisplayed = ref(false); // 下拉菜单是否已经渲染
    let dropdownVisible = ref(false); // 下拉菜单是否显示
    let dropdownDisplayDirection = ref('bottom'); // 下拉菜单展示方位
    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);
    let treeRef = ref(null);

    /**
     * 显示下拉菜单
     */
    let dropdownShow = function () {
      if (props.disabled) {
        return;
      }
      dropdownVisible.value = true;
      nextTick(function () {
        if (props.defaultExpandCheckedNodesParent) {
          // 展开选中节点的父级节点
          (treeRef.value as any).expandCheckedNodesParent();
        }
      });
    };
    /**
     * 隐藏下拉菜单
     */
    let dropdownHide = function () {
      // 延迟一会隐藏下拉菜单是因为为了等待背景色改变后再隐藏
      // let timer = setTimeout(function () {
      //   clearTimeout(timer);
      dropdownVisible.value = false;
      isFocus.value = false;
      // }, 120);
    };

    /**
     * 调用当前<bs-form-item>父组件的方法
     * @param fnName 方法名称
     * @param args 参数
     */
    let callFormItem = function (fnName: string, ...args: any) {
      nextTick(function () {
        if (formItemContext) {
          (formItemContext as any)[fnName](...args);
        }
      });
    };

    /**
     * 修改值
     * @param val 值
     * @param isDelete 是否移除
     */
    /* let changeVal = function (val: any, isDelete?: boolean) {
      if (props.multiple) {
        let selectModelValue: unknown[] = (props.modelValue || []).slice();
        if (isDelete === true) {
          let index = selectModelValue.indexOf(val);
          if (index > -1) {
            // console.log('changeVal 2, isDelete=true', props.modelValue, val, index);
            selectModelValue.splice(index, 1);
            ctx.emit('update:modelValue', selectModelValue);
            ctx.emit('change', selectModelValue);
            callFormItem('validate', 'change');
          }
        } else {
          let multipleLimit = props.multipleLimit;
          if (typeof multipleLimit === 'number' && multipleLimit > 0 && selectModelValue.length >= multipleLimit) {
            ctx.emit('selectLimit', multipleLimit);
            return;
          }
          selectModelValue.push(val);
          ctx.emit('update:modelValue', selectModelValue);
          ctx.emit('change', selectModelValue);
          callFormItem('validate', 'change');
        }
      } else {
        if (isDelete === true) {
          if (props.modelValue === val) {
            // console.log('changeVal 2, isDelete=true', props.modelValue, val);
            ctx.emit('update:modelValue', '');
            ctx.emit('change', '');
            dropdownHide();
            callFormItem('validate', 'change');
            return;
          }
          return;
        }
        ctx.emit('update:modelValue', val);
        ctx.emit('change', val);
        dropdownHide();
        callFormItem('validate', 'change');
      }
    }; */

    // 树组件的modelValue
    let treeModelValue = computed({
      get () {
        let modelValue = props.modelValue;
        if (!Array.isArray(modelValue)) {
          modelValue = [modelValue];
        }
        if (!props.multiple) {
          modelValue = [modelValue[0]];
        }
        return modelValue;
      },
      set (treeModelNewVal: any) {
        console.log('设置新的tree-select值：', treeModelNewVal);
        if (props.multiple) {
          // let modelValue: (string|number)[] = newVal;
          let result = [...treeModelNewVal];
          ctx.emit('update:modelValue', result);
          ctx.emit('change', result);
          callFormItem('validate', 'change');
        } else {
          let newVal = Array.isArray(treeModelNewVal) ? treeModelNewVal[0] : treeModelNewVal;
          console.log('newVal', newVal);
          ctx.emit('update:modelValue', newVal);
          ctx.emit('change', newVal);
          callFormItem('validate', 'change');
        }
      }
    });

    let onEnter = function (el:HTMLElement, done: () => void) {
      console.log('onEnter执行了');
      let bsSelectRect = (bsTreeSelectRef.value as HTMLElement).getBoundingClientRect();
      // let bsSelectDropdownEl = bsSelectDropdownRef.value as HTMLElement;

      let displayDirection: any = util.calcAbsoluteElementDisplayDirection(bsTreeSelectRef.value, el, 'bottom', false);
      dropdownDisplayDirection.value = displayDirection.direction;
      el.style.width = bsSelectRect.width + 'px';
      el.style.top = displayDirection.top + 'px';
      el.style.left = displayDirection.left + 'px';

      let onTransitionDone = function () {
        done();
        // console.log('leave onTransitionDone');
        el.removeEventListener('transitionend', onTransitionDone, false);
        el.removeEventListener('transitioncancel', onTransitionDone, false);
      };
      // 绑定元素的transition完成事件，在transition完成后立即完成vue的过度动效
      el.addEventListener('transitionend', onTransitionDone, false);
      el.addEventListener('transitioncancel', onTransitionDone, false);
    };

    let viewText = ref('');
    watch(() => props.modelValue, function () {
      nextTick(function () {
        if (treeRef.value) {
          let labels = (treeRef.value as any).getCheckedNodesLabel();
          viewText.value = labels.join(',');
        }
      });
    }, { immediate: true });
    watch([() => props.clearable, viewText], function (newVals: any[]) {
      (bsInputRef.value as any).setClearIconDisplay(newVals[0] && newVals[1].length > 0);
    });

    let isClickOutside = useClickOutside([bsTreeSelectRef, bsSelectDropdownRef]);
    watch(isClickOutside, (newVal: boolean) => {
      // console.log('isClickOutside', isClickOutside.value);
      if (newVal) {
        dropdownHide();
      }
    });

    let onSelectRootClick = function () {
      if (props.disabled || props.loading) {
        return;
      }
      isFocus.value = true;
      dropdownShow();
    };

    // 清空内容
    let onInputClear = function () {
      let val = props.multiple ? [] : '';
      ctx.emit('update:modelValue', val);
      ctx.emit('change', val);
      callFormItem('validate', 'change');
    };

    if (props.deliveContextToFormItem) {
      // 传递给<bs-form-item>组件的参数
      let deliverToFormItemCtx = {
        id: selectId.value,
        setValidateStatus: (status: ValidateStatus) => {
          // console.log('调select组件的setValidateStatus方法l');
          if (bsInputRef.value) {
            (bsInputRef.value as any).setValidateStatus(status);
          }
        }
      };
      // 如果当前组件处在<bs-form-item>组件中，则将setValidateStatus方法存储到<bs-form-item>组件中
      useDeliverContextToParent<FormItemContext>(formItemContextKey, deliverToFormItemCtx);
    }

    return {
      bsTreeSelectRef,
      bsInputRef,
      treeRef,
      bsSelectDropdownRef,
      bsInputReadonly,
      isFocus,
      selectId,
      dropdownDisplayed,
      dropdownVisible,
      dropdownDisplayDirection,
      viewText,
      treeModelValue,

      onSelectRootClick,
      onInputClear,
      onEnter,
      dropdownShow,
      dropdownHide
    };
  }
});
</script>

<style lang="scss">
@import "bs-tree-select";
</style>
