// src/icons/BsiArrowUp.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiArrowUp = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "arrow-up",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "fill-rule": "evenodd", "d": "M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" }, "children": [] }]
  });
};
BsiArrowUp.displayName = "BsiArrowUp";
var BsiArrowUp_default = BsiArrowUp;
export {
  BsiArrowUp,
  BsiArrowUp_default as default
};