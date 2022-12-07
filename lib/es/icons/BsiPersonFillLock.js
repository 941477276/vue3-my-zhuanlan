// src/icons/BsiPersonFillLock.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiPersonFillLock = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "person-fill-lock",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5v-1a1.9 1.9 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2Zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z" }, "children": [] }]
  });
};
BsiPersonFillLock.displayName = "BsiPersonFillLock";
var BsiPersonFillLock_default = BsiPersonFillLock;
export {
  BsiPersonFillLock,
  BsiPersonFillLock_default as default
};