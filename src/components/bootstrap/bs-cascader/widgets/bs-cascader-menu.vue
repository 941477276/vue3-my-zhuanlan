<template>
  <ul class="bs-cascader-menu" role="menu">
    <li class="bs-cascader-menu-item">
      <BsCheckbox
        :delive-context-to-form-item="false"></BsCheckbox>
      <div class="bs-cascader-menu-item-label">深圳市</div>
      <BsIcon name="chevron-right"></BsIcon>
    </li>
    <li class="bs-cascader-menu-item is-checked">
      <BsCheckbox
        :delive-context-to-form-item="false"></BsCheckbox>
      <div class="bs-cascader-menu-item-label">龙岗区</div>
      <BsIcon name="chevron-right"></BsIcon>
    </li>
    <li class="bs-cascader-menu-item is-checked">
      <BsCheckbox
        :delive-context-to-form-item="false"></BsCheckbox>
      <div class="bs-cascader-menu-item-label">龙岗区</div>
      <BsIcon name="chevron-right"></BsIcon>
    </li>
    <li class="bs-cascader-menu-item is-checked">
      <BsCheckbox
        :delive-context-to-form-item="false"></BsCheckbox>
      <div class="bs-cascader-menu-item-label">龙岗区</div>
      <BsIcon name="chevron-right"></BsIcon>
    </li>
    <li class="bs-cascader-menu-item is-checked">
      <BsCheckbox
        :delive-context-to-form-item="false"></BsCheckbox>
      <div class="bs-cascader-menu-item-label">龙岗区</div>
      <BsIcon name="chevron-right"></BsIcon>
    </li>
    <li class="bs-cascader-menu-item is-checked">
      <BsCheckbox
        :delive-context-to-form-item="false"></BsCheckbox>
      <div class="bs-cascader-menu-item-label">龙岗区</div>
      <BsIcon name="chevron-right"></BsIcon>
    </li>

  </ul>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsCheckbox from '../../bs-checkbox/BsCheckbox.vue';
import BsRadio from '../../bs-radio/BsRadio.vue';
import BsIcon from '../../bs-icon/BsIcon.vue';

export default defineComponent({
  name: 'bs-cascader-menu',
  components: {
    BsCheckbox,
    BsIcon
  }
});
</script>
