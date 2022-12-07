// src/icons/BsiFileDiffFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiFileDiffFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "file-diff-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8.5 4.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5a.5.5 0 0 1 1 0zM6 10h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1z" }, "children": [] }]
  });
};
BsiFileDiffFill.displayName = "BsiFileDiffFill";
var BsiFileDiffFill_default = BsiFileDiffFill;
export {
  BsiFileDiffFill,
  BsiFileDiffFill_default as default
};