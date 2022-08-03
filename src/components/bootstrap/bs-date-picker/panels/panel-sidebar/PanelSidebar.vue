<template>
  <div
    class="panel-sidebar"
    :class="{
      'in-right': align == 'right'
    }">
    <button type="button">今天</button>
    <button type="button">本周第一天</button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'PanelSidebar',
  props: {
    align: {
      type: String,
      default: 'left'
    }
  }
});
</script>

<style lang="scss">
.panel-sidebar{
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
