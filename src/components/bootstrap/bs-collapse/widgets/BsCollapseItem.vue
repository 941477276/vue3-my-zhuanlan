<template>
  <div
    class="bs-collapse-item"
    :class="{
        'is-active': isExpanded2,
        'is-disabled': disabled
      }"
    :data-id="collapseItemId">
    <div
      ref="headerRef"
      class="bs-collapse-item-header"
      :class="{
        'arrow-left': arrowLeft
      }"
      role="tab"
      tabindex="0"
      :aria-expanded="isExpanded2"
      @click="onHeaderClick">
      <span v-if="showArrow && arrowLeft" class="bs-collapse-header-arrow">
        <BsIcon name="chevron-right"></BsIcon>
      </span>
      <slot name="title">{{ title }}</slot>
      <span v-if="showArrow && !arrowLeft" class="bs-collapse-header-arrow">
        <BsIcon name="chevron-right"></BsIcon>
      </span>
    </div>
    <BsCollapseTransition v-if="rendered">
      <div
        v-show="isExpanded2"
        class="bs-collapse-item-body">
        <div class="bs-collapse-item-content">
          <slot></slot>
        </div>
      </div>
    </BsCollapseTransition>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  nextTick,
  inject,
  computed,
  watch
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import BsCollapseTransition from '../../bs-collapse-transition/BsCollapseTransition.vue';
import {
  bsCollapseContextKey,
  CollapseContext
} from '@/ts-tokens/bootstrap/collapse';

let collapseItemCount = 0;
export default defineComponent({
  name: 'BsCollapseItem',
  components: {
    BsIcon,
    BsCollapseTransition
  },
  props: {
    title: { // 标题
      type: [String, Number],
      default: ''
    },
    name: { // 唯一标志符
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    arrowLeft: { // 箭头是否在左侧
      type: Boolean,
      default: false
    }
  },
  setup (props: any, ctx: any) {
    let countId = collapseItemCount++;
    let collapseItemId = ref(`bs_collapse_item-${countId}`);
    let headerRef = ref<HTMLElement|null>(null);
    // let isExpanded = ref(false); // 是否为展开
    let isExpanded2 = ref(false);
    let rendered = ref(false); // 是否已经渲染body

    // 折叠面板父级组件上下文
    let collapseCtx: CollapseContext = inject<CollapseContext>(bsCollapseContextKey)!;

    let nameOrCountId = computed(function () {
      let propsName = props.name;
      if ((typeof propsName !== 'string' && typeof propsName !== 'number') || (propsName + '').length == 0) {
        return countId;
      }
      return propsName;
    });

    watch(collapseCtx?.activeNames, function (activeNames) {
      let flag = (activeNames || []).includes(nameOrCountId.value);
      // console.log('activeNames', activeNames, flag);
      if (flag) {
        if (!rendered.value) {
          rendered.value = true;
          nextTick(function () {
            isExpanded2.value = true;
          });
          return;
        }
        // console.log('isExpanded2的值为true');
        isExpanded2.value = true;
        return;
      }
      isExpanded2.value = false;
    }, { immediate: true, deep: true });

    let onHeaderClick = function (evt: Event) {
      if (props.disabled) {
        return;
      }
      collapseCtx?.handleItemChange(!isExpanded2.value, nameOrCountId.value);
    };

    return {
      headerRef,
      collapseItemId,
      // isExpanded,
      isExpanded2,
      rendered,

      onHeaderClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-collapse-item";
</style>
