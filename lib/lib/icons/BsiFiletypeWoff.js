"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/icons/BsiFiletypeWoff.ts
var BsiFiletypeWoff_exports = {};
__export(BsiFiletypeWoff_exports, {
  BsiFiletypeWoff: () => BsiFiletypeWoff,
  default: () => BsiFiletypeWoff_default
});
module.exports = __toCommonJS(BsiFiletypeWoff_exports);
var import_vue = require("vue");
var import_BsIcon = __toESM(require("../components/BsIcon"));
var BsiFiletypeWoff = function(props, ctx) {
  return (0, import_vue.createVNode)(import_BsIcon.default, {
    ...props,
    iconName: "filetype-woff",
    isFilled: false,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "fill-rule": "evenodd", "d": "M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-5.464 9.688v-.522c0-.257-.04-.471-.117-.641a.861.861 0 0 0-.323-.387.862.862 0 0 0-.468-.129.868.868 0 0 0-.472.13.868.868 0 0 0-.32.386c-.077.17-.116.384-.116.641v.522c0 .256.039.47.117.641a.866.866 0 0 0 .319.387.883.883 0 0 0 .472.126.877.877 0 0 0 .468-.126.861.861 0 0 0 .323-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.069.7-.205.973-.137.271-.333.48-.59.627-.253.144-.559.216-.916.216-.356 0-.662-.072-.92-.216a1.463 1.463 0 0 1-.59-.627 2.151 2.151 0 0 1-.204-.973v-.513c0-.379.068-.704.205-.975.137-.274.333-.483.589-.627.258-.147.564-.22.92-.22.357 0 .663.073.917.22.256.146.452.356.589.63.136.271.205.595.205.972Zm-6.064-.536-.74 2.79h-.73l-1.055-4h.855l.601 2.903h.038l.706-2.903h.683l.706 2.903h.04l.596-2.903h.858l-1.055 4h-.73l-.74-2.79h-.033Zm7.398 2.79v-1.592h1.606v-.638h-1.606v-1.117h1.758v-.653H9.882v4h.791Zm2.988-1.592v1.591h-.791v-3.999h2.548v.653h-1.757v1.117h1.605v.638h-1.605Z" }, "children": [] }]
  });
};
BsiFiletypeWoff.displayName = "BsiFiletypeWoff";
var BsiFiletypeWoff_default = BsiFiletypeWoff;