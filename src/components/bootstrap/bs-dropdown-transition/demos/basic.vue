<docs>
---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic usage
---

## zh-CN
需给`bs-dropdown-transition`传递一个`reference-ref`属性，该属性的值可以是一个`组件`、`dom节点`

## en-US
A `reference-ref` attribute needs to be passed to `bs-dropdown-transition`, and the value of this attribute can be a `component`, `dom node`

</docs>

<template>
  <div>
    <bs-button ref="referenceRef" type="primary" @click="show = !show">{{ show ? 'Hide' : 'Show' }} custom dropdown</bs-button>
    <bs-button type="primary" @click="allowTeleport = true">Teleport to body</bs-button>

    <teleport :disabled="!allowTeleport" to="body">
      <bs-dropdown-transition :reference-ref="referenceRef">
        <ul
          v-show="show"
          class="my-custom-dropdown"
          @click="onDropdownClick">
          <li>Html</li>
          <li>Javascript</li>
          <li>Css</li>
        </ul>
      </bs-dropdown-transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let show = ref(false);
let allowTeleport = ref(false);

let referenceRef = ref();
let onDropdownClick = function () {
  show.value = !show.value;
};
</script>

<style lang="scss" scoped>
.my-custom-dropdown{
  position: absolute;
  z-index: 999;
  border: 1px solid #f0f0f0;
  background-color: #fff;
  li{
    height: 2rem;
    line-height: 2rem;
    padding: 0 1rem;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all .3s;
    &:hover{
      color: #fff;
      background-color: var(--primary);
    }
  }
}
.bs-button {
  margin: 0 1rem 1rem 0;
}
</style>
