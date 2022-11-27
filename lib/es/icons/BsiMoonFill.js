// src/icons/BsiMoonFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiMoonFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "moon-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" }, "children": [] }]
  });
};
BsiMoonFill.displayName = "BsiMoonFill";
var BsiMoonFill_default = BsiMoonFill;
export {
  BsiMoonFill_default as default
};
