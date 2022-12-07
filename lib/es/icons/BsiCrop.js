// src/icons/BsiCrop.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiCrop = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "crop",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M3.5.5A.5.5 0 0 1 4 1v13h13a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2H3.5a.5.5 0 0 1-.5-.5V4H1a.5.5 0 0 1 0-1h2V1a.5.5 0 0 1 .5-.5zm2.5 3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4H6.5a.5.5 0 0 1-.5-.5z" }, "children": [] }]
  });
};
BsiCrop.displayName = "BsiCrop";
var BsiCrop_default = BsiCrop;
export {
  BsiCrop,
  BsiCrop_default as default
};