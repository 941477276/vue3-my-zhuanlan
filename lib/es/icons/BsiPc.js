// src/icons/BsiPc.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiPc = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "pc",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M5 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H5Zm.5 14a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1Zm2 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1ZM5 1.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5ZM5.5 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1Z" }, "children": [] }]
  });
};
BsiPc.displayName = "BsiPc";
var BsiPc_default = BsiPc;
export {
  BsiPc_default as default
};
