<template>
  <div
    class="bs-progress progress"
    :class="[
      `bs-progress-${colorType}`
    ]">
    <div
      class="progress-bar"
      :class="[
        `bg-${colorType}`,
        {
          'progress-bar-striped': striped,
          'progress-bar-animated': animated
        }
      ]"
      style="width: 30%;"
      role="progressbar"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"></div>
  </div>
</template>

<script lang="ts">
import { BsColorType, supportedBsColorTypes } from '@/ts-tokens/bootstrap';
import {
  defineComponent,
  PropType,
  ref,
  onMounted
} from 'vue';

type ColorFunctionType = (percentage: number) => string|Array<{color: string;percentage:number}>;
interface MultipleProgressDefine {
  progress: number;
  colorType: BsColorType;
  showText: boolean;
  color: string|Array<{color: string;percentage:number}>|ColorFunctionType;
  textFormat: (percentage: number) => string;
  striped: boolean;
  animated: boolean;
};

const tagSupportedBsColorTypes = [...supportedBsColorTypes];
tagSupportedBsColorTypes.pop();

export default defineComponent({
  name: 'BsProgress',
  components: {
  },
  props: {
    percentage: { // 进度值
      type: Number,
      default: 0
    },
    percentages: { // 多个进度条，只有在multiple为true时有效
      type: Array as PropType<MultipleProgressDefine[]>,
      default () {
        return [];
      }
    },
    showText: { // 是否显示进度值
      type: Boolean,
      default: true
    },
    textFormat: { // 指定进度条文字内容
      type: Function,
      default: null
    },
    colorType: { // 颜色类型
      type: String as PropType<BsColorType>,
      default: 'primary',
      validator (typeVal: BsColorType) {
        return tagSupportedBsColorTypes.includes(typeVal);
      }
    },
    striped: { // 是否为条纹进度条
      type: Boolean,
      default: false
    },
    animated: { // 是否为显示条纹动画
      type: Boolean,
      default: false
    },
    multiple: { // 是否为多个进度条
      type: Boolean,
      default: false
    }
  },
  emit: ['close', 'click'],
  setup (props: any, ctx: any) {
    let show = ref(false);

    onMounted(function () {
      show.value = true;
    });

    let doClose = function () {
      let beforeClose = props.beforeClose;
      if (typeof beforeClose === 'function') {
        let res = beforeClose();
        if (res === false) {
          return;
        }
      }
      show.value = false;
      ctx.emit('close');
    };

    let doClick = function () {
      ctx.emit('click');
    };

    return {
      show,
      doClose,
      doClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-progress";
</style>
