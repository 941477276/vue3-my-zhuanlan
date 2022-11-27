// src/icons/BsiNumber1SquareFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiNumber1SquareFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "number-1-square-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm7.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383h1.312Z" }, "children": [] }]
  });
};
BsiNumber1SquareFill.displayName = "BsiNumber1SquareFill";
var BsiNumber1SquareFill_default = BsiNumber1SquareFill;
export {
  BsiNumber1SquareFill_default as default
};
