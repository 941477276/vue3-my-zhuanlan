<template>
  <transition name="bs-toast-fade">
    <div
      class="bs-toast toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :class="classNames"
      :data-id="toastId">
      <div
        class="toast-header"
        :class="[type ? `bg-${type}` : '']">
        <slot name="header">{{ title }}</slot>
        <button type="button" class="close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        <slot>{{ message }}</slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  PropType,
  ref,
  computed,
  defineComponent
} from 'vue';
import {
  ToastPlacement
} from '@/ts-tokens/bootstrap/toast';
import {
  BsColorType
} from '@/ts-tokens/bootstrap';

let toastCount = 0;
export default defineComponent({
  name: 'BsToast',
  props: {
    title: { // 标题
      type: [String, Number, Object],
      default: ''
    },
    message: { // 内容
      type: [String, Number, Object],
      default: ''
    },
    placement: { // 显示方位
      type: String as PropType<ToastPlacement>,
      default: ''
    },
    type: { // 类型
      type: String as PropType<BsColorType>,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    className: {
      type: [String, Array],
      default: ''
    },
    fixed: {
      type: Boolean,
      default: null
    }
  },
  setup (props: any, ctx: any) {
    let toastId = ref(props.id ? props.id : `bs-toast_${++toastCount}`);

    let classNames = computed(function () {
      let classArr = [props.className];
      let type = props.type;
      if (type) {
        classArr.push(`bs-toast-${type}`);
        // classArr.push(`bg-${type}`);
      }
      if (props.fixed) {
        classArr.push('position-fixed');
      }
      let classNameProps = props.className;
      if (Array.isArray(classNameProps)) {
        classArr.push(...classNameProps);
      } else {
        classArr.push(classNameProps);
      }
      return classArr;
    });
    return {
      toastId,
      classNames
    };
  }
});
</script>

<style lang="scss">
@import "bs-toast";
</style>
