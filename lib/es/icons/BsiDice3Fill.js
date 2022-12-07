// src/icons/BsiDice3Fill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiDice3Fill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "dice-3-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3zm2.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" }, "children": [] }]
  });
};
BsiDice3Fill.displayName = "BsiDice3Fill";
var BsiDice3Fill_default = BsiDice3Fill;
export {
  BsiDice3Fill,
  BsiDice3Fill_default as default
};