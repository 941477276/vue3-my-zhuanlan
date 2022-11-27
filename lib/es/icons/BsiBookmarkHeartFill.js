// src/icons/BsiBookmarkHeartFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiBookmarkHeartFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "bookmark-heart-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.5zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" }, "children": [] }]
  });
};
BsiBookmarkHeartFill.displayName = "BsiBookmarkHeartFill";
var BsiBookmarkHeartFill_default = BsiBookmarkHeartFill;
export {
  BsiBookmarkHeartFill_default as default
};
