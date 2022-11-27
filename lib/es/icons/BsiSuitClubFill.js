// src/icons/BsiSuitClubFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiSuitClubFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "suit-club-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M11.5 12.5a3.493 3.493 0 0 1-2.684-1.254 19.92 19.92 0 0 0 1.582 2.907c.231.35-.02.847-.438.847H6.04c-.419 0-.67-.497-.438-.847a19.919 19.919 0 0 0 1.582-2.907 3.5 3.5 0 1 1-2.538-5.743 3.5 3.5 0 1 1 6.708 0A3.5 3.5 0 1 1 11.5 12.5z" }, "children": [] }]
  });
};
BsiSuitClubFill.displayName = "BsiSuitClubFill";
var BsiSuitClubFill_default = BsiSuitClubFill;
export {
  BsiSuitClubFill_default as default
};
