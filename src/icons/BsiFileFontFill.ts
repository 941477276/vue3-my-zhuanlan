// this file is generate by ../../scripts/generate.js
// do not edit manually

import {
  FunctionalComponent,
  createVNode
} from 'vue';
import BsIcon, { BsIconProps } from '../components/BsIcon';

export interface BsiFileFontFillType extends FunctionalComponent<BsIconProps> {
  displayName: string;
};

// define icon component
const BsiFileFontFill: BsiFileFontFillType = function (props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    // ...ctx.attrs,
    iconName: 'file-font-fill',
    isFilled: true,
    viewBox: props.viewBox || '0 0 16 16',
    svgChildrenVDom: [{"nodeName":"path","nodeType":1,"attrs":{"d":"M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5.057 4h5.886L11 6h-.5c-.18-1.096-.356-1.192-1.694-1.235l-.298-.01v6.09c0 .47.1.582.903.655v.5H6.59v-.5c.799-.073.898-.184.898-.654V4.755l-.293.01C5.856 4.808 5.68 4.905 5.5 6H5l.057-2z"},"children":[]}]
  });
};
BsiFileFontFill.displayName = 'BsiFileFontFill';
export default BsiFileFontFill;
export { BsiFileFontFill };