// src/icons/BsiNumber1CircleFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiNumber1CircleFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "number-1-circle-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM9.283 4.002H7.971L6.072 5.385v1.271l1.834-1.318h.065V12h1.312V4.002Z" }, "children": [] }]
  });
};
BsiNumber1CircleFill.displayName = "BsiNumber1CircleFill";
var BsiNumber1CircleFill_default = BsiNumber1CircleFill;
export {
  BsiNumber1CircleFill_default as default
};
