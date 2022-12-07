// src/icons/BsiSignpostFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiSignpostFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "signpost-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M7.293.707A1 1 0 0 0 7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414A1 1 0 0 0 7.293.707z" }, "children": [] }]
  });
};
BsiSignpostFill.displayName = "BsiSignpostFill";
var BsiSignpostFill_default = BsiSignpostFill;
export {
  BsiSignpostFill,
  BsiSignpostFill_default as default
};