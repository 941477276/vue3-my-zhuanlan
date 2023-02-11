import {
  ref,
  defineComponent,
  h,
  watch,
  nextTick,
  onBeforeUnmount
} from 'vue';
import { isNoneValue } from '@/common/bs-util';
import { useGlobalEvent } from '@/hooks/useGlobalEvent';

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

    let calcHeight = function (text: string) {
      nextTick(function () {
        let height = 0;
        if (isNoneValue(text)) {
          height = -1;
        } else {
          height = textareaRef.value?.scrollHeight || 0;
        }
        // console.log('text offsetHeight: ', height);
        ctx.emit('height-change', height);
      });
    };

    let resizeEventHandler = function () {
      calcHeight(props.text);
    };

    watch(() => props.text, function (text) {
      calcHeight(text);
    }, { immediate: true, flush: 'post' });

    useGlobalEvent.addEvent('window', 'resize', resizeEventHandler);
    onBeforeUnmount(function () {
      useGlobalEvent.removeEvent('window', 'resize', resizeEventHandler);
    });
    return function () {
      return h('textarea', {
        ref: textareaRef,
        class: 'form-control bs-ghost-textarea',
        value: props.text
      });
    };
  }
});
