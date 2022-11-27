<template>
  <span
    class="bs-icon2"
    role="img"
    :class="[
      `bs-icon-${iconName}`,
      {
        'bs-icon-filled': isFilled
      }
    ]"
    :aria-label="iconName">
    <IconBase
      v-bind="$props"></IconBase>
  </span>
</template>
<script>
import {
  defineComponent
} from 'vue';
import IconBase, { IconProps } from './IconBase';
import './bs-icon.css';

export default defineComponent({
  name: 'BsIcon2',
  components: {
    IconBase
  },
  props: {
    width: {
      type: String
    },
    height: {
      type: String
    },
    fill: {
      type: String
    },
    viewBox: {
      type: String
    },
    ariaHidden: {
      type: Boolean,
      default: true
    },
    focusable: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: ''
    },
    isFilled: {
      type: Boolean,
      default: false
    },
    svgChildrenVDom: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  emits: ['click', 'dblclick']
});
</script>
