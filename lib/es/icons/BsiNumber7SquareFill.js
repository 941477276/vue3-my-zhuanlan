// src/icons/BsiNumber7SquareFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiNumber7SquareFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "number-7-square-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.37 5.11V4.001h5.308V5.15L7.42 12H6.025l3.317-6.82v-.07H5.369Z" }, "children": [] }]
  });
};
BsiNumber7SquareFill.displayName = "BsiNumber7SquareFill";
var BsiNumber7SquareFill_default = BsiNumber7SquareFill;
export {
  BsiNumber7SquareFill_default as default
};
