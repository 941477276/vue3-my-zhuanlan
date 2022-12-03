// this file is generate by ../../scripts/generate.js
// do not edit manually

import {
  FunctionalComponent,
  createVNode
} from 'vue';
import BsIcon, { BsIconProps } from '../components/BsIcon';

export interface BsiSuperscriptType extends FunctionalComponent<BsIconProps> {
  displayName: string;
};

// define icon component
const BsiSuperscript: BsiSuperscriptType = function (props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    // ...ctx.attrs,
    iconName: 'superscript',
    isFilled: false,
    viewBox: props.viewBox || '0 0 16 16',
    svgChildrenVDom: [{"nodeName":"path","nodeType":1,"attrs":{"d":"m4.266 12.496.96-2.853H8.76l.96 2.853H11L7.62 3H6.38L3 12.496h1.266Zm2.748-8.063 1.419 4.23h-2.88l1.426-4.23h.035Zm5.132-1.797v-.075c0-.332.234-.618.619-.618.354 0 .618.256.618.58 0 .362-.271.649-.52.898l-1.788 1.832V6h3.59v-.958h-1.923v-.045l.973-1.04c.415-.438.867-.845.867-1.547 0-.8-.701-1.41-1.787-1.41C11.565 1 11 1.8 11 2.576v.06h1.146Z"},"children":[]}]
  });
};
BsiSuperscript.displayName = 'BsiSuperscript';
export default BsiSuperscript;
export { BsiSuperscript };