// src/icons/BsiArrowsCollapse.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiArrowsCollapse = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "arrows-collapse",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "fill-rule": "evenodd", "d": "M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8Zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0Zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793Z" }, "children": [] }]
  });
};
BsiArrowsCollapse.displayName = "BsiArrowsCollapse";
var BsiArrowsCollapse_default = BsiArrowsCollapse;
export {
  BsiArrowsCollapse_default as default
};
