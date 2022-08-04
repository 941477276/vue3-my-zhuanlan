<template>
  <div
    class="bs-panel-sidebar"
    :class="{
      'in-right': align == 'right'
    }">
    <button
      v-for="item in shortcuts"
      :key="item.text"
      :disabled="item.disabled"
      type="button"
      @click="onBtnClick(item)">{{ item.text }}</button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsPanelSidebar',
  props: {
    align: {
      type: String,
      default: 'left'
    },
    shortcuts: { // 侧边栏快捷按钮
      type: Array,
      default () {
        return [];
      }
    }
  },
  setup () {
    let onBtnClick = function (shortcut: any) {
      console.log('shortcut click', shortcut);
    };
    return {
      onBtnClick
    };
  }
});
</script>

<style lang="scss">
.bs-panel-sidebar{
  //padding: 0.5rem;
  font-size: 0.875rem;
  border-right: 1px solid #eee;
  &.in-right{
    border-right: none;
    border-left: 1px solid #eee;
  }
  button{
    display: block;
    width: 100%;
    line-height: 1.875rem; // 30px
    padding: 0 0.625rem;
    border: none;
    outline: none;
    color: #222;
    background-color: #fff;
    transition: color .2s;
    &:hover{
      color: var(--primary);
    }
  }
}
</style>
