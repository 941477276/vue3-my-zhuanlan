import {
  ref,
  defineComponent,
  h,
  watch,
  nextTick
} from 'vue';
import { isNoneValue } from '@/common/bs-util';

export const GhostTextarea = defineComponent({
  name: 'GhostTextarea',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  emits: ['height-change'],
  setup (props: any, ctx: any) {
    let textareaRef = ref<HTMLTextAreaElement|null>(null);

    watch(() => props.text, function (text) {
      nextTick(function () {
        let height = 0;
        if (isNoneValue(text)) {
          height = -1;
        } else {
          height = textareaRef.value?.scrollHeight || 0;
        }
        console.log('text offsetHeight: ', height);
        ctx.emit('height-change', height);
      });
    }, { immediate: true, flush: 'post' });

    return function () {
      return h('textarea', {
        ref: textareaRef,
        class: 'form-control bs-ghost-textarea',
        value: props.text
      });
    };
  }
});
