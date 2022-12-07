// src/icons/BsiSafe2Fill.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiSafe2Fill = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "safe2-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M6.563 8H5.035a3.482 3.482 0 0 1 .662-1.596l1.08 1.08c-.094.16-.167.332-.214.516zm.921-1.223-1.08-1.08A3.482 3.482 0 0 1 8 5.035v1.528c-.184.047-.357.12-.516.214zM9 6.563V5.035a3.482 3.482 0 0 1 1.596.662l-1.08 1.08A1.988 1.988 0 0 0 9 6.563zm1.223.921 1.08-1.08c.343.458.577 1.003.662 1.596h-1.528a1.989 1.989 0 0 0-.214-.516zM10.437 9h1.528a3.483 3.483 0 0 1-.662 1.596l-1.08-1.08c.094-.16.167-.332.214-.516zm-.921 1.223 1.08 1.08A3.483 3.483 0 0 1 9 11.965v-1.528c.184-.047.357-.12.516-.214zM8 10.437v1.528a3.483 3.483 0 0 1-1.596-.662l1.08-1.08c.16.094.332.167.516.214zm-1.223-.921-1.08 1.08A3.482 3.482 0 0 1 5.035 9h1.528c.047.184.12.357.214.516zM7.5 8.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M2.5 1A1.5 1.5 0 0 0 1 2.5V3H.5a.5.5 0 0 0 0 1H1v4H.5a.5.5 0 0 0 0 1H1v4H.5a.5.5 0 0 0 0 1H1v.5A1.5 1.5 0 0 0 2.5 16h12a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 14.5 1h-12zm6 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" }, "children": [] }]
  });
};
BsiSafe2Fill.displayName = "BsiSafe2Fill";
var BsiSafe2Fill_default = BsiSafe2Fill;
export {
  BsiSafe2Fill,
  BsiSafe2Fill_default as default
};