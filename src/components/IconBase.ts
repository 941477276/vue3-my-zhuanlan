import {
  h
} from 'vue';

function IconBase (props: any) {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: props.width || '1em',
    height: props.height || '1em',
    fill: props.fill || 'currentColor',
    viewBox: props.viewBox || '0 0 1024 1024',
    ariaHidden: props.ariaHidden === true ? 'true' : 'false',
    focusable: props.focusable === true ? 'true' : 'false',
    'data-icon': props.iconName
  }, props.svgContent);
};

IconBase.props = ['width', 'height', 'fill', 'viewBox', 'ariaHidden', 'focusable', 'iconName'];
IconBase.inheritAttrs = false;

export default IconBase;
