// src/icons/BsiBadge4k.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiBadge4k = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "badge-4k",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M4.807 5.001C4.021 6.298 3.203 7.6 2.5 8.917v.971h2.905V11h1.112V9.888h.733V8.93h-.733V5.001h-1.71zm-1.23 3.93v-.032a46.781 46.781 0 0 1 1.766-3.001h.062V8.93H3.577zm9.831-3.93h-1.306L9.835 7.687h-.057V5H8.59v6h1.187V9.075l.615-.699L12.072 11H13.5l-2.232-3.415 2.14-2.584z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" }, "children": [] }]
  });
};
BsiBadge4k.displayName = "BsiBadge4k";
var BsiBadge4k_default = BsiBadge4k;
export {
  BsiBadge4k,
  BsiBadge4k_default as default
};