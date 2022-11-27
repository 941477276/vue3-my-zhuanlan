// src/icons/BsiIntersect.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiIntersect = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "intersect",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5zm6-8V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2V6a2 2 0 0 1 2-2h5z" }, "children": [] }]
  });
};
BsiIntersect.displayName = "BsiIntersect";
var BsiIntersect_default = BsiIntersect;
export {
  BsiIntersect_default as default
};
