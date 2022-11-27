// src/icons/BsiPersonBadgeFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiPersonBadgeFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "person-badge-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.245z" }, "children": [] }]
  });
};
BsiPersonBadgeFill.displayName = "BsiPersonBadgeFill";
var BsiPersonBadgeFill_default = BsiPersonBadgeFill;
export {
  BsiPersonBadgeFill_default as default
};
