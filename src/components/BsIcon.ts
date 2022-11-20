
import {
  defineComponent,
  h,
  render,
  createVNode,
  SetupContext
} from 'vue';
import IconBase from './IconBase';

export default defineComponent({
  name: 'BsIcon',
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
    svgContent: {
      type: String,
      default: ''
    }
  },
  setup (props: any, ctx: SetupContext) {
    return () => {
      let iconName = props.iconNamel;
      return h('span', {
        role: 'img',
        'class': [
          'bs-icon',
          `bs-icon-${iconName}`,
          {
            'bs-icon-filled': props.isFilled
          }
        ],
        'area-label': iconName,
        onClick (evt: MouseEvent) {
          ctx.emit('click', evt);
        }
      }, createVNode(IconBase, props));
    };
  }
});
