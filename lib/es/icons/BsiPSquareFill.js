// src/icons/BsiPSquareFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiPSquareFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "p-square-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M8.27 8.074c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.5 4.002h2.962C10.045 4.002 11 5.104 11 6.586c0 1.494-.967 2.578-2.55 2.578H6.784V12H5.5V4.002Z" }, "children": [] }]
  });
};
BsiPSquareFill.displayName = "BsiPSquareFill";
var BsiPSquareFill_default = BsiPSquareFill;
export {
  BsiPSquareFill_default as default
};
