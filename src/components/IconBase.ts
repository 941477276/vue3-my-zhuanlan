import {
  h
} from 'vue';

function IconBase (props: any) {
  let svgChildren = props.svgVDom.children.filter((vdomChild: any) => {
    return vdomChild.nodeType == 1 || (vdomChild.nodeType == 3 && vdomChild.text != ' ');
  }).map((vdomChild: any) => {
    return vdomChild.noteType == 3 ? vdomChild.text : h(
      vdomChild.nodeName,
      {
        ...vdomChild.attrs
      }
    );
  });
  // @ts-ignore
  IconBase.displayName = props.iconName;
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: props.width || '1em',
    height: props.height || '1em',
    fill: props.fill || 'currentColor',
    viewBox: props.viewBox || props.svgVDom.attrs.viewBox || '0 0 1024 1024',
    ariaHidden: props.ariaHidden === true ? 'true' : 'false',
    focusable: props.focusable === true ? 'true' : 'false',
    'data-icon': props.iconName
  }, svgChildren);
};

IconBase.props = ['width', 'height', 'fill', 'viewBox', 'ariaHidden', 'focusable', 'iconName', 'svgVDom'];
IconBase.inheritAttrs = false;

export default IconBase;
