<template>
  <div class="bs-back-top">
    <slot>
      <div class="bs-back-top-inner">
        <i></i>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsBackTop',
  props: {
    target: {
      type: [Object, String, Function],
      default: null
    }
  }
});
</script>

<style lang="scss">
.bs-back-top{
  position: fixed;
  right: 30px;
  bottom: 30px;
  cursor: pointer;
}
.bs-back-top-inner{
  //position: relative;
  display: flex;
  width: 2rem;
  height: 2rem;
  //line-height: 2rem;
  text-align: center;
  border-radius: 0.125rem;
  background-color: rgba(0,0,0,0.45);
  transition: background-color .3s;
  i{
    display: block;
    transform: translateY(calc(0.625rem / 4));
    margin: auto;
    &::before{
      display: block;
      content: ' ';
      width: 0.625rem;
      height: 0.625rem;
      border-top: 2px solid #efefef;
      border-left: 2px solid #efefef;
      transform: rotate(45deg);
      //margin-top: 0.3125rem;
    }
  }
  &:hover{
    background-color: rgba(0,0,0,0.6);
  }
}
</style>
