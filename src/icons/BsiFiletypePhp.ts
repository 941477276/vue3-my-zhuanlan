// this file is generate by ../../scripts/generate.js
// do not edit manually

import {
  FunctionalComponent,
  createVNode
} from 'vue';
import BsIcon, { BsIconProps } from '../components/BsIcon';

export interface BsiFiletypePhpType extends FunctionalComponent<BsIconProps> {
  displayName: string;
};

// define icon component
const BsiFiletypePhp: BsiFiletypePhpType = function (props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    // ...ctx.attrs,
    iconName: 'filetype-php',
    isFilled: false,
    viewBox: props.viewBox || '0 0 16 16',
    svgChildrenVDom: [{"nodeName":"path","nodeType":1,"attrs":{"fill-rule":"evenodd","d":"M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.295.185.522Zm4.48 2.666V11.85h-.79v1.626H4.153V11.85h-.79v3.999h.79v-1.714h1.682v1.714h.79Zm.703-3.999h1.6c.288 0 .533.06.732.179.2.117.354.276.46.477.105.201.158.427.158.677 0 .25-.054.476-.161.677-.106.199-.26.357-.463.474a1.452 1.452 0 0 1-.733.173H8.12v1.342h-.791V11.85Zm2.06 1.714a.795.795 0 0 0 .084-.381c0-.227-.061-.4-.184-.521-.123-.122-.294-.182-.513-.182h-.66v1.406h.66a.794.794 0 0 0 .375-.082.574.574 0 0 0 .237-.24Z"},"children":[]}]
  });
};
BsiFiletypePhp.displayName = 'BsiFiletypePhp';
export default BsiFiletypePhp;