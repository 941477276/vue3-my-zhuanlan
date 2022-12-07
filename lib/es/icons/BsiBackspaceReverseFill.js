// src/icons/BsiBackspaceReverseFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiBackspaceReverseFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "backspace-reverse-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M0 3a2 2 0 0 1 2-2h7.08a2 2 0 0 1 1.519.698l4.843 5.651a1 1 0 0 1 0 1.302L10.6 14.3a2 2 0 0 1-1.52.7H2a2 2 0 0 1-2-2V3zm9.854 2.854a.5.5 0 0 0-.708-.708L7 7.293 4.854 5.146a.5.5 0 1 0-.708.708L6.293 8l-2.147 2.146a.5.5 0 0 0 .708.708L7 8.707l2.146 2.147a.5.5 0 0 0 .708-.708L7.707 8l2.147-2.146z" }, "children": [] }]
  });
};
BsiBackspaceReverseFill.displayName = "BsiBackspaceReverseFill";
var BsiBackspaceReverseFill_default = BsiBackspaceReverseFill;
export {
  BsiBackspaceReverseFill,
  BsiBackspaceReverseFill_default as default
};