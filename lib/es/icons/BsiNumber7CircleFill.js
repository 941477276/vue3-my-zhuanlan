// src/icons/BsiNumber7CircleFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiNumber7CircleFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "number-7-circle-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM5.37 5.11h3.972v.07L6.025 12H7.42l3.258-6.85V4.002H5.369v1.107Z" }, "children": [] }]
  });
};
BsiNumber7CircleFill.displayName = "BsiNumber7CircleFill";
var BsiNumber7CircleFill_default = BsiNumber7CircleFill;
export {
  BsiNumber7CircleFill_default as default
};
