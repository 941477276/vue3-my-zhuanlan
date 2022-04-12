<!--<template>
  <div
    class="bs-progress progress"
    :class="[
      `bs-progress-${colorType}`
    ]">
    <BsProgressBar
      v-if="!multiple"
      v-bind="$props">
      &lt;!&ndash;<template><slot></slot></template>&ndash;&gt;
      <slot></slot>
    </BsProgressBar>
    <template v-else>
      <BsProgressBar
        v-for="(progress, index) in progresses"
        v-bind="progress"
        :key="`multiple_progress_item-${index}`">
        <slot></slot>
      </BsProgressBar>
    </template>
  </div>
</template>-->

<script lang="ts">
import {
  defineComponent,
  h
} from 'vue';
import props, { MultipleProgressDefine } from './bs-progress-props';
import BsProgressBar from './widgets/BsProgressBar.vue';

export default defineComponent({
  name: 'BsProgress',
  components: {
    BsProgressBar
  },
  props,
  emit: ['close', 'click'],
  setup (props: any, ctx: any) {
    return function () {
      let children;
      let slotDefault = ctx.slots.default;

      if (!props.multiple) {
        children = h(BsProgressBar, props, slotDefault);
      } else {
        children = props.progresses.map((progress: MultipleProgressDefine, index: number) => {
          return h(BsProgressBar, {
            ...progress,
            key: `multiple_progress_item-${index}`
          }, slotDefault);
        });
      }
      // console.log('children', children);

      return h('div', {
        'class': ['bs-progress progress', `bs-progress-${props.colorType}`]
      }, children);
    };
  }
});
</script>

<style lang="scss">

</style>
