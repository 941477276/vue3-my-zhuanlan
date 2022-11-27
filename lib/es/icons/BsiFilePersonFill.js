// src/icons/BsiFilePersonFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiFilePersonFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "file-person-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-1 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-3 4c2.623 0 4.146.826 5 1.755V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1.245C3.854 11.825 5.377 11 8 11z" }, "children": [] }]
  });
};
BsiFilePersonFill.displayName = "BsiFilePersonFill";
var BsiFilePersonFill_default = BsiFilePersonFill;
export {
  BsiFilePersonFill_default as default
};
