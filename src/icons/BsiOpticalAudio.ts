// this file is generate by ../../scripts/generate.js
// do not edit manually

import {
  FunctionalComponent,
  createVNode
} from 'vue';
import BsIcon, { BsIconProps } from '../components/BsIcon';

export interface BsiOpticalAudioType extends FunctionalComponent<BsIconProps> {
  displayName: string;
};

// define icon component
const BsiOpticalAudio: BsiOpticalAudioType = function (props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    // ...ctx.attrs,
    iconName: 'optical-audio',
    isFilled: false,
    viewBox: props.viewBox || '0 0 16 16',
    svgChildrenVDom: [{"nodeName":"path","nodeType":1,"attrs":{"d":"M8 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"},"children":[]},{"nodeName":"path","nodeType":1,"attrs":{"d":"M4.5 9a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0ZM8 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"},"children":[]},{"nodeName":"path","nodeType":1,"attrs":{"d":"M2 14.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-3.05a2.5 2.5 0 0 0 0-4.9V4.5a.5.5 0 0 0-.146-.354l-2-2A.5.5 0 0 0 11.5 2h-7a.5.5 0 0 0-.354.146l-2 2A.5.5 0 0 0 2 4.5v2.05a2.5 2.5 0 0 0 0 4.9v3.05Zm1-.5v-3a.5.5 0 0 0-.5-.5 1.5 1.5 0 1 1 0-3A.5.5 0 0 0 3 7V4.707L4.707 3h6.586L13 4.707V7a.5.5 0 0 0 .5.5 1.5 1.5 0 0 1 0 3 .5.5 0 0 0-.5.5v3H3Z"},"children":[]}]
  });
};
BsiOpticalAudio.displayName = 'BsiOpticalAudio';
export default BsiOpticalAudio;