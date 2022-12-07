// src/icons/BsiBarChartLine.ts
import {
  createVNode
} from "vue";
import BsIcon from "../components/BsIcon";
var BsiBarChartLine = function(props, ctx) {
  return createVNode(BsIcon, {
    ...props,
    iconName: "bar-chart-line",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z" }, "children": [] }]
  });
};
BsiBarChartLine.displayName = "BsiBarChartLine";
var BsiBarChartLine_default = BsiBarChartLine;
export {
  BsiBarChartLine,
  BsiBarChartLine_default as default
};