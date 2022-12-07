// src/icons/BsiSkipForwardCircle.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiSkipForwardCircle = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "skip-forward-circle",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M4.271 5.055a.5.5 0 0 1 .52.038L7.5 7.028V5.5a.5.5 0 0 1 .79-.407L11 7.028V5.5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-1 0V8.972l-2.71 1.935a.5.5 0 0 1-.79-.407V8.972l-2.71 1.935A.5.5 0 0 1 4 10.5v-5a.5.5 0 0 1 .271-.445z" }, "children": [] }]
  });
};
BsiSkipForwardCircle.displayName = "BsiSkipForwardCircle";
var BsiSkipForwardCircle_default = BsiSkipForwardCircle;
export {
  BsiSkipForwardCircle,
  BsiSkipForwardCircle_default as default
};