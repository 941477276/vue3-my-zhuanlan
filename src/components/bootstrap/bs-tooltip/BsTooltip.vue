<template>
  <BsPopper>
    <BsPopperTrigger>
      <bs-button type="primary" v-if="triggerElType == 1">一个按钮</bs-button>
      <mark v-if="triggerElType == 2">一个按钮</mark>
    </BsPopperTrigger>
    <BsPopperContent
      popper-class="bs-tooltip">
      我是一个 <strong>Popper</strong>内容 !
      <p>我是一个popper!我是一个popper!我是一个popper!我是一个popper!我是一个popper!我是一个popper!我是一个popper!我是一个popper!</p>
      <BsPopperArrow></BsPopperArrow>
    </BsPopperContent>
  </BsPopper>
</template>

<script lang="ts">
import {
  cloneVNode,
  defineComponent,
  ref
} from 'vue';
import BsPopper from '../bs-popper/BsPopper.vue';
import BsPopperTrigger from '../bs-popper/BsPopperTrigger.vue';
import BsPopperContent from '../bs-popper/BsPopperContent.vue';
import BsPopperArrow from '../bs-popper/BsPopperArrow.vue';
export default defineComponent({
  name: 'BsTooltip',
  components: {
    BsPopper,
    BsPopperTrigger,
    BsPopperContent,
    BsPopperArrow
  },
  setup () {
    let triggerElType = ref(1);
    let setTriggerEl = function (type: number) {
      triggerElType.value = type;
    };
    return {
      triggerElType,
      setTriggerEl
    };
  }
});
</script>

<style lang="scss">
@import "bs-tooltip";
</style>
