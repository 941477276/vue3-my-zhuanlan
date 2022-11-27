// src/icons/BsiSave2.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiSave2 = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "save2",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" }, "children": [] }]
  });
};
BsiSave2.displayName = "BsiSave2";
var BsiSave2_default = BsiSave2;
export {
  BsiSave2_default as default
};
