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
      <BsDropdownTransition
        placement="bottom"
        :reference-ref="bsTreeSelectRef"
        :try-all-placement="false">
        <div
          v-show="dropdownVisible"
          ref="bsSelectDropdownRef"
          class="bs-tree-select-dropdown"
          :class="{
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
            :expand-on-click-node="checkStrictly"
            :lazy="lazy"></BsTree>
        </div>
      </BsDropdownTransition>
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
  formItemContextKey,
  StringKeyObject
} from '@/ts-tokens/bootstrap';
import { util } from '@/common/util';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import BsInput from '../bs-input/BsInput.vue';
import BsTree from '../bs-tree/BsTree.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import { bsTreeSelectProps } from './props';

let treeSelectCount = 0;
export default defineComponent({
  name: 'BsTreeSelect',
  components: {
    BsInput,
    BsTree,
    BsDropdownTransition
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

    let hideTimer: number;
    /**
     * 隐藏下拉菜单
     */
    let dropdownHide = function (useTimeout = false) {
      if (useTimeout) {
        clearTimeout(hideTimer);
        // 这里延迟180毫秒是为了能让用户看到选中项到变化
        hideTimer = setTimeout(function () {
          dropdownVisible.value = false;
          isFocus.value = false;
        }, 180);
      } else {
        dropdownVisible.value = false;
        isFocus.value = false;
      }
      console.log('调用隐藏函数了');
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
          dropdownHide(true);
        }
      }
    });

    let viewText = ref('');
    watch(() => props.modelValue, function () {
      nextTick(function () {
        let labels = props.labels;
        if (props.lazy && !labels) {
          console.warn('labels is required when lazy=true!');
        }
        if (treeRef.value) {
          labels = labels || [];
          let labelsFromTree = (treeRef.value as any).getCheckedNodesLabel();
          labelsFromTree.forEach((labelItem: StringKeyObject) => {
            let index = labels.findIndex((label: StringKeyObject) => labelItem.value === label.value);
            // 优先使用从props中传递过来的label
            if (index > -1) {
              labelItem.label = labels[index].label;
            }
          });
          viewText.value = labelsFromTree.map((labelItem: StringKeyObject) => labelItem.label).join(',');
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

    let onSelectRootClick = function (evt: MouseEvent) {
      if (props.disabled || props.loading) {
        return;
      }
      let target = evt.target;
      if (treeRef.value && (util.elementContains((treeRef.value as any).$el, target) || (treeRef.value as any).$el === target)) {
        return;
      }
      if (dropdownVisible.value) {
        dropdownHide();
      } else {
        isFocus.value = true;
        dropdownShow();
      }
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
      viewText,
      treeModelValue,

      onSelectRootClick,
      onInputClear,
      dropdownShow,
      dropdownHide
    };
  }
});
</script>

<style lang="scss">
@import "bs-tree-select";
</style>
