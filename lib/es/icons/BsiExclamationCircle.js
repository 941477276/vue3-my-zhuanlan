// src/icons/BsiExclamationCircle.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiExclamationCircle = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "exclamation-circle",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" }, "children": [] }]
  });
};
BsiExclamationCircle.displayName = "BsiExclamationCircle";
var BsiExclamationCircle_default = BsiExclamationCircle;
export {
  BsiExclamationCircle_default as default
};
