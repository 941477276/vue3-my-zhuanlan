// src/icons/BsiChatRightQuote.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiChatRightQuote = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "chat-right-quote",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" }, "children": [] }]
  });
};
BsiChatRightQuote.displayName = "BsiChatRightQuote";
var BsiChatRightQuote_default = BsiChatRightQuote;
export {
  BsiChatRightQuote,
  BsiChatRightQuote_default as default
};