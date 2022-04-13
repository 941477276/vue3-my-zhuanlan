<!--<template>
  <li
    class="bs-tabs-nav-item"
    :data-tabs-nav-item-id="id"
    :class="{
      'is-disabled': disabled
    }"
    @click="onClick">
    <button
      type="button"
      :disabled="disabled"
      :aria-label="label"
      class="bs-tabs-nav-button">
      <slot>{{ label }}</slot>
    </button>
  </li>
</template>-->

<script lang="ts">
import {
  defineComponent,
  h
} from 'vue';

export default defineComponent({
  name: 'BsTabsNavItem',
  props: {
    label: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    itemSlot: {
      type: Function,
      default: null
    }
  },
  emits: ['click'],
  setup (props: any, ctx: any) {
    let onClick = function () {
      if (props.disabled) {
        return;
      }
      ctx.emit('click', props.name);
    };

    return () => {
      let children = h('button', {
        'class': 'bs-tabs-nav-button',
        type: 'button',
        'aria-label': props.label,
        disabled: props.disabled
      }, typeof props.itemSlot === 'function' ? props.itemSlot() : props.label);
      // console.log('itemSlot', typeof props.itemSlot === 'function' ? props.itemSlot() : props.label);
      return h('li', {
        'class': [
          'bs-tabs-nav-item',
          {
            'is-disabled': props.disabled
          }
        ],
        'data-tabs-nav-item-id': props.id,
        onClick
      }, children);
    };
  }
});
</script>
