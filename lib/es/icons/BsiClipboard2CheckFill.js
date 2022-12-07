// src/icons/BsiClipboard2CheckFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiClipboard2CheckFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "clipboard2-check-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5Zm6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708Z" }, "children": [] }]
  });
};
BsiClipboard2CheckFill.displayName = "BsiClipboard2CheckFill";
var BsiClipboard2CheckFill_default = BsiClipboard2CheckFill;
export {
  BsiClipboard2CheckFill,
  BsiClipboard2CheckFill_default as default
};