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

// src/icons/BsiEnvelopeOpenHeartFill.ts
var BsiEnvelopeOpenHeartFill_exports = {};
__export(BsiEnvelopeOpenHeartFill_exports, {
  BsiEnvelopeOpenHeartFill: () => BsiEnvelopeOpenHeartFill,
  default: () => BsiEnvelopeOpenHeartFill_default
});
module.exports = __toCommonJS(BsiEnvelopeOpenHeartFill_exports);
var import_vue = require("vue");
var import_BsIcon = __toESM(require("../components/BsIcon"));
var BsiEnvelopeOpenHeartFill = function(props, ctx) {
  return (0, import_vue.createVNode)(import_BsIcon.default, {
    ...props,
    iconName: "envelope-open-heart-fill",
    isFilled: true,
    viewBox: props.viewBox || "0 0 16 16",
    svgChildrenVDom: [{ "nodeName": "path", "nodeType": 1, "attrs": { "d": "M8.941.435a2 2 0 0 0-1.882 0l-6 3.2A2 2 0 0 0 0 5.4v.313l4.222 2.475c.024-.058.05-.114.08-.17.665-1.3 2.362-1.917 3.698-1.25 1.336-.667 3.033-.05 3.699 1.25a3.3 3.3 0 0 1 .08.17L16 5.713V5.4a2 2 0 0 0-1.059-1.765l-6-3.2ZM0 6.873l4 2.344c-.012.542.124 1.117.416 1.694l.004.006L0 13.372v-6.5Zm.059 7.611 4.9-2.723c.563.73 1.383 1.467 2.49 2.198l.551.365.551-.365c1.107-.73 1.927-1.467 2.49-2.198l4.9 2.723A2 2 0 0 1 14 16H2a2 2 0 0 1-1.941-1.516ZM16 13.372l-4.42-2.455.004-.006c.292-.577.428-1.152.415-1.694L16 6.873v6.5Z" }, "children": [] }, { "nodeName": "path", "nodeType": 1, "attrs": { "d": "M8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" }, "children": [] }]
  });
};
BsiEnvelopeOpenHeartFill.displayName = "BsiEnvelopeOpenHeartFill";
var BsiEnvelopeOpenHeartFill_default = BsiEnvelopeOpenHeartFill;