// src/icons/BsiDownload.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiDownload = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "download",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" }, "children": [] }]
  });
};
BsiDownload.displayName = "BsiDownload";
var BsiDownload_default = BsiDownload;
export {
  BsiDownload_default as default
};
