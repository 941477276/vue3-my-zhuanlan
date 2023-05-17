<template>
  <div
    class="bs-collapse"
    :class="{
      'bs-collapse-simple': simple,
      'bs-collapse-focus-effect': headerFocusEffect
    }"
    role="tablist"
    :aria-multiselectable="!accordion">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  Ref,
  ref,
  defineComponent,
  provide,
  watch
} from 'vue';
import {
  bsCollapseContextKey,
  CollapseContext,
  CollapseItemContext
} from '../../ts-tokens/bootstrap/collapse';

export default defineComponent({
  name: 'BsCollapse',
  props: {
    modelValue: { // 当前激活的面板的 name，可以使用 v-model 双向绑定
      type: [String, Number, Array],
      default: ''
    },
    accordion: { // 是否开启手风琴模式，开启后每次至多展开一个面板
      type: Boolean,
      default: false
    },
    simple: { // 是否为简洁模式
      type: Boolean,
      default: false
    },
    headerFocusEffect: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let activeNames: Ref<(string|number)[]> = ref(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]);

    // 处理折叠面板状态改变
    let handleItemChange = function (expended: boolean, name: string|number) {
      let isAccordion = props.accordion;
      let activeNamesArr = activeNames.value;
      if (expended) {
        if (isAccordion) {
          // console.log('aaa');
          // 重新赋值一个新函数不起作用
          activeNamesArr.length = 0;
          activeNamesArr[0] = name;
        } else {
          activeNamesArr.push(name);
        }
      } else {
        if (isAccordion) {
          // console.log(111);
          activeNamesArr.length = 0;
        } else {
          // console.log(222);
          let index = activeNamesArr.findIndex(item => item == name);
          if (index > -1) {
            activeNamesArr.splice(index, 1);
          }
        }
      }
      let value = isAccordion ? activeNamesArr[0] : [...activeNamesArr];
      // console.log('handleItemChange', name, expended, value);
      ctx.emit('update:modelValue', isAccordion ? activeNamesArr[0] : [...activeNamesArr]);
      ctx.emit('change', name, expended, value);
    };

    watch(() => props.modelValue, function (modelValue) {
      modelValue = Array.isArray(modelValue) ? modelValue : [modelValue];
      // console.log('watch modelValue', modelValue, modelValue.join(','), activeNames.value.join(','));
      if (modelValue.join(',') == activeNames.value.join(',')) {
        return;
      }
      // console.log('watch modelValue and set activeNames: ', [...modelValue]);
      // activeNames.value = [...modelValue];
      activeNames.value = [...modelValue];
    }, { immediate: true, deep: true });

    provide<CollapseContext>(bsCollapseContextKey, {
      activeNames,
      handleItemChange
    });

    return {
      // collapseItemCtxs
    };
  }
});
</script>
