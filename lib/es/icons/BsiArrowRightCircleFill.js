// src/icons/BsiArrowRightCircleFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiArrowRightCircleFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "arrow-right-circle-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" }, "children": [] }]
  });
};
BsiArrowRightCircleFill.displayName = "BsiArrowRightCircleFill";
var BsiArrowRightCircleFill_default = BsiArrowRightCircleFill;
export {
  BsiArrowRightCircleFill_default as default
};
