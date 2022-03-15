<template>
  <div
    class="form-check bs-radio"
    :class="{
      'is-disabled': disabled || disabledInner,
      'is-readonly': readonly || readonlyInner,
      'is-focus': isFocus,
      'is-checked': isChecked
    }">
    <input
      class="form-check-input"
      type="radio"
      autocomplete="off"
      :name="name || null"
      :id="radioId"
      :value="value"
      :disabled="disabled || disabledInner"
      :readonly="readonly || readonlyInner"
      :checked="isChecked"
      :aria-label="ariaLabel || null"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @change="on_change">
    <label
      class="form-check-label"
      :for="radioId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onUpdated, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { getRadioCount } from '@/common/globalData';

export default defineComponent({
  name: 'BsRadio',
  components: {},

  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      default: '',
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '',
      validator (idVal: string) {
        if (/^\d/.test(idVal)) {
          console.warn('id不能以数字开头');
          return false;
        }
        return true;
      }
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
  inheritAttrs: false,
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let radioCount = getRadioCount();
    // 计算单选框的ID
    let radioId = computed(() => {
      return props.id || `bs-radio_${radioCount}`;
    });
    let isFocus = ref(false);

    // 获取当前组件所在的父级<bs-radio-group>组件
    let getRadioGroup = function ():ComponentInternalInstance|null {
      let $parent = (getCurrentInstance() as ComponentInternalInstance).parent;

      while ($parent && $parent?.type.name !== 'BsRadioGroup') {
        $parent = $parent?.parent || null;
      }

      return $parent;
    };
    // 当前组件所在的父级<bs-radio-group>组件
    let $radioGroup = ref<ComponentInternalInstance|null>(getRadioGroup());
    onUpdated(() => {
      // 组件更新的时候重新获取当前组件的父级<bs-radio-group>组件
      $radioGroup.value = getRadioGroup();
    });

    // console.log('当前组建实例：', getCurrentInstance());
    // console.log('组件的<bs-radio-group>组件：', getRadioGroup());
    // 判断是否在<bs-radio-group>组件内
    let isInGroup = computed(() => {
      return !!$radioGroup.value;
    });
    let isChecked = computed(() => {
      let flag = false;
      if (isInGroup.value) {
        let $radioGroupIns = $radioGroup.value as ComponentInternalInstance;
        flag = (props.value === $radioGroupIns.props.modelValue) || (props.value === $radioGroupIns.props.value);
      } else {
        flag = props.modelValue === props.value;
      }
      return flag;
    });

    let disabledInner = ref(false);
    let readonlyInner = ref(false);
    let setDisabled = function (flag: boolean) {
      disabledInner.value = false;
    };
    let setReadonly = function (flag: boolean) {
      readonlyInner.value = false;
    };

    /* eslint-disable */
    let on_change = function (evt: Event) {
      // console.log(evt);
      if (isInGroup.value) {
        // 调用<bs-radio-group>组件的changeVal方法将值传递出去，父组件setup中暴露出去的函数及属性都可以在父组件都ctx中获取的到
        ($radioGroup.value as any)?.ctx.changeVal(props.value);
      } else {
        ctx.emit('update:modelValue', props.value);
      }
      ctx.emit('change', props.value, evt);
    };
    return {
      radioId,
      isFocus,
      isChecked,

      disabledInner,
      readonlyInner,
      setDisabled,
      setReadonly,

      on_change
    };
  }
});
</script>

<style lang="scss">
.bs-radio{
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
  & + .bs-radio{
    margin-left: 20px;
  }
  .form-check-input{
    margin-top: 0.35rem;
  }
  .form-check-label{
    padding-left: 0.3rem;
    margin-left: -0.3rem;
  }
}
</style>
