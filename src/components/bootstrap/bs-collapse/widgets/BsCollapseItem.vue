<template>
  <div class="bs-collapse-item">
    <div
      class="bs-collapse-item-header"
      :class="{
        'arrow-left': arrowLeft,
        'is-active': true,
        'is-disabled': disabled
      }"
      role="tab"
      tabindex="0"
      aria-expanded="false">
      <span v-if="showArrow && arrowLeft" class="bs-collapse-header-arrow">
        <BsIcon name="chevron-right"></BsIcon>
      </span>
      <div class="bs-collapse-item-header-text">Html</div>
      <span v-if="showArrow && !arrowLeft" class="bs-collapse-header-arrow">
        <BsIcon name="chevron-right"></BsIcon>
      </span>
    </div>
    <div class="bs-collapse-item-body"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';

export default defineComponent({
  name: 'BsCollapseItem',
  components: {
    BsIcon
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    arrowLeft: { // 箭头是否在左侧
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss">
.bs-collapse-item-header{
  display: flex;
  padding: 0.625rem 0;
  cursor: pointer;
  color: #333;
  transition: box-shadow .15s ease-in-out;
  background-color: #f0f0f0;
  &.arrow-left{
    .bs-collapse-header-arrow{
      margin-left: 0;
      margin-right: 0.5rem;
    }
  }
  &.is-disabled{
    cursor: not-allowed;
    color: rgba(0,0,0,0.5);
  }
  &.is-active{
    .bs-collapse-header-arrow{
      transform: rotate(90deg);
    }
  }
  &:focus{
    outline: transparent;
    box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
  }
}
.bs-collapse-header-arrow{
  margin-left: auto;
  transition: transform .3s;
}
</style>
