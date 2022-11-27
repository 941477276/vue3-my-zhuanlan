// src/icons/BsiInputCursor.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiInputCursor = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "input-cursor",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "fill-rule": "evenodd", "d": "M8 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 8 1z" }, "children": [] }]
  });
};
BsiInputCursor.displayName = "BsiInputCursor";
var BsiInputCursor_default = BsiInputCursor;
export {
  BsiInputCursor_default as default
};
