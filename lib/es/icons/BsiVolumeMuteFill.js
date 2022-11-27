// src/icons/BsiVolumeMuteFill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiVolumeMuteFill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "volume-mute-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" }, "children": [] }]
  });
};
BsiVolumeMuteFill.displayName = "BsiVolumeMuteFill";
var BsiVolumeMuteFill_default = BsiVolumeMuteFill;
export {
  BsiVolumeMuteFill_default as default
};
