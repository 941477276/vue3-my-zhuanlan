// this file is generate by ../../scripts/generate.js
// do not edit manually

import {
  FunctionalComponent,
  createVNode
} from 'vue';
import BsIcon, { BsIconProps } from '../components/BsIcon';

export interface BsiTrainFreightFrontType extends FunctionalComponent<BsIconProps> {
  displayName: string;
};

// define icon component
const BsiTrainFreightFront: BsiTrainFreightFrontType = function (props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    // ...ctx.attrs,
    iconName: 'train-freight-front',
    isFilled: false,
    viewBox: props.viewBox || '0 0 16 16',
    svgChildrenVDom: [{"nodeName":"path","nodeType":1,"attrs":{"d":"M5.065.158A1.5 1.5 0 0 1 5.736 0h4.528a1.5 1.5 0 0 1 .67.158l3.237 1.618a1.5 1.5 0 0 1 .83 1.342V13.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V3.118a1.5 1.5 0 0 1 .828-1.342L5.065.158ZM2 9.372V13.5A1.5 1.5 0 0 0 3.5 15h4V8h-.853a.5.5 0 0 0-.144.021L2 9.372ZM8.5 15h4a1.5 1.5 0 0 0 1.5-1.5V9.372l-4.503-1.35A.5.5 0 0 0 9.353 8H8.5v7ZM14 8.328v-5.21a.5.5 0 0 0-.276-.447l-3.236-1.618A.5.5 0 0 0 10.264 1H5.736a.5.5 0 0 0-.223.053L2.277 2.67A.5.5 0 0 0 2 3.118v5.21l1-.3V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.028l1 .3Zm-2-.6V5H8.5v2h.853a1.5 1.5 0 0 1 .431.063L12 7.728ZM7.5 7V5H4v2.728l2.216-.665A1.5 1.5 0 0 1 6.646 7H7.5Zm-1-5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm-3 8a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Zm9 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1ZM5 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"},"children":[]}]
  });
};
BsiTrainFreightFront.displayName = 'BsiTrainFreightFront';
export default BsiTrainFreightFront;