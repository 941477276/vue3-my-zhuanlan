// src/icons/BsiShiftFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiShiftFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "shift-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M7.27 2.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-3H1.654C.78 10.5.326 9.455.924 8.816L7.27 2.047z" }, "children": [] }]
  });
};
BsiShiftFill.displayName = "BsiShiftFill";
var BsiShiftFill_default = BsiShiftFill;
export {
  BsiShiftFill_default as default
};
