// src/icons/BsiBoxArrowDownRight.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiBoxArrowDownRight = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "box-arrow-down-right",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "fill-rule": "evenodd", "d": "M8.636 12.5a.5.5 0 0 1-.5.5H1.5A1.5 1.5 0 0 1 0 11.5v-10A1.5 1.5 0 0 1 1.5 0h10A1.5 1.5 0 0 1 13 1.5v6.636a.5.5 0 0 1-1 0V1.5a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h6.636a.5.5 0 0 1 .5.5z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "fill-rule": "evenodd", "d": "M16 15.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h3.793L6.146 6.854a.5.5 0 1 1 .708-.708L15 14.293V10.5a.5.5 0 0 1 1 0v5z" }, "children": [] }]
  });
};
BsiBoxArrowDownRight.displayName = "BsiBoxArrowDownRight";
var BsiBoxArrowDownRight_default = BsiBoxArrowDownRight;
export {
  BsiBoxArrowDownRight_default as default
};
