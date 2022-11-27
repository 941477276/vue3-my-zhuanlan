// src/icons/BsiXDiamondFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiXDiamondFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "x-diamond-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098l2.904 2.905z" }, "children": [] }]
  });
};
BsiXDiamondFill.displayName = "BsiXDiamondFill";
var BsiXDiamondFill_default = BsiXDiamondFill;
export {
  BsiXDiamondFill_default as default
};
