<template>
  <bs-config-provider size="sm">
    <!--<div class="box">
      <BsButtonUsage></BsButtonUsage>
    </div>-->
    <!--<div class="box">
      <BsButtonGroupUsage></BsButtonGroupUsage>
    </div>-->
    <!--<div class="box">
      <BsInputUsage></BsInputUsage>
    </div>-->
    <!--<div class="box">
      <BsRadioUsage></BsRadioUsage>
    </div>-->
    <!--<div class="box">
      <BsRadioGroupUsage></BsRadioGroupUsage>
    </div>-->
    <!--<div class="box">
      <BsCheckboxUsage></BsCheckboxUsage>
    </div>-->
    <!--<div class="box">
      <BsCheckboxGroupUsage></BsCheckboxGroupUsage>
    </div>-->
    <!--<div class="box">
      <BsSelectUsage></BsSelectUsage>
    </div>-->
    <!--<div class="box">
      <BsFormUsage></BsFormUsage>
    </div>-->
    <!--<div class="box">
      <BsDropdownUsage></BsDropdownUsage>
    </div>-->
    <!--<router-view></router-view>-->
    <!--<div class="box">
      <BsPaginationUsage></BsPaginationUsage>
    </div>-->
    <!--<div class="box">
      <BsBadgeUsage></BsBadgeUsage>
    </div>-->
    <!--<div class="box">
      <BsMessageUsage></BsMessageUsage>
    </div>-->
    <!--<div class="box">
      <BsBreadcrumbUsage></BsBreadcrumbUsage>
    </div>-->
    <!--<div class="box">
      <BsTagUsage></BsTagUsage>
    </div>-->
    <!--<div class="box">
      <BsProgressUsage></BsProgressUsage>
    </div>-->
    <!--<div class="box">
      <BsTabsUsage></BsTabsUsage>
    </div>-->
    <!--<div class="box">
      <BsSwitchUsage></BsSwitchUsage>
    </div>-->
    <!--<div class="box">
      <BsMessageBoxUsage></BsMessageBoxUsage>
    </div>-->
    <!--<div class="box">
      <BsMaskUsage></BsMaskUsage>
    </div>-->
    <!--<div class="box">
      <BsAlertUsage></BsAlertUsage>
    </div>-->
    <!--<div class="box">
      <BsInputNumberUsage></BsInputNumberUsage>
    </div>-->
    <!--<div class="box">
      <BsPopperUsage></BsPopperUsage>
    </div>-->
    <!--<div class="box">
      <BsTooltipUsage></BsTooltipUsage>
    </div>-->
    <!--<div class="box">
      <BsSliderUsage></BsSliderUsage>
    </div>-->
    <!--<div class="box">
      <BsModalUsage></BsModalUsage>
    </div>-->
    <!--<div class="box">
      <BsDrawerUsage></BsDrawerUsage>
    </div>-->
    <!--<div class="box">
      <BsPopoverUsage></BsPopoverUsage>
    </div>-->
    <!--<div class="box">
      <BsSpinnerUsage></BsSpinnerUsage>
    </div>-->
    <div class="box">
      <BsPopConfirmUsage></BsPopConfirmUsage>
    </div>
    <!--<div class="box">
      <BsCollapseUsage></BsCollapseUsage>
    </div>-->
    <!--<div class="box">
      <BsTreeUsage></BsTreeUsage>
    </div>-->
    <!--<div class="box">
      <BsTreeSelectUsage></BsTreeSelectUsage>
    </div>-->
    <!--<div class="box">
      <BsInputTagsUsage></BsInputTagsUsage>
    </div>-->
    <!--<div class="box">
      <BsSelectInputUsage></BsSelectInputUsage>
    </div>-->
    <!--<div class="box">
      <BsTimePickerUsage></BsTimePickerUsage>
    </div>-->
    <!--<div class="box">
      <BsDatePickerUsage></BsDatePickerUsage>
    </div>-->
    <!--<div class="box">
      <BsBackTopUsage></BsBackTopUsage>
    </div>-->
    <!--<div class="box">
      <BsRelativeTimeUsage></BsRelativeTimeUsage>
    </div>-->
    <!--<div class="box">
      <BsLoadingUsage></BsLoadingUsage>
    </div>-->
    <!--<div class="box">
      <BsCascaderUsage></BsCascaderUsage>
    </div>-->
    <!--<div class="box">
      <BsToastUsage></BsToastUsage>
    </div>-->
    <!--<div class="box">
      <BsMenuUsage></BsMenuUsage>
    </div>-->
  </bs-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive } from 'vue';
// import HelloWorld from './components/HelloWorld.vue'
// import AsyncValidatorUsage from './components/AsyncValidatorUsage.vue';
import BsFormUsage from '@/components/bootstrap/bs-form/BsFormUsage.vue';
import BsButtonUsage from '@/components/bootstrap/bs-button/BsButtonUsage.vue';
import BsButtonGroupUsage from '@/components/bootstrap/bs-button-group/BsButtonGroupUsage.vue';
import BsInputUsage from '@/components/bootstrap/bs-input/BsInputUsage.vue';
import BsRadioUsage from '@/components/bootstrap/bs-radio/BsRadioUsage.vue';
import BsRadioGroupUsage from '@/components/bootstrap/bs-radio-group/BsRadioGroupUsage.vue';
import BsCheckboxUsage from '@/components/bootstrap/bs-checkbox/BsCheckboxUsage.vue';
import BsCheckboxGroupUsage from '@/components/bootstrap/bs-checkbox-group/BsCheckboxGroupUsage.vue';
import BsSelectUsage from '@/components/bootstrap/bs-select/BsSelectUsage.vue';
import BsDropdownUsage from '@/components/bootstrap/bs-dropdown/BsDropdownUsage.vue';
import BsPaginationUsage from '@/components/bootstrap/bs-pagination/BsPaginationUsage.vue';
import BsBadgeUsage from '@/components/bootstrap/bs-badge/BsBadgeUsage.vue';
import BsMessageUsage from '@/components/bootstrap/bs-message/BsMessageUsage.vue';
import BsBreadcrumbUsage from '@/components/bootstrap/bs-breadcrumb/BsBreadcrumbUsage.vue';
import BsTagUsage from '@/components/bootstrap/bs-tag/BsTagUsage.vue';
import BsProgressUsage from '@/components/bootstrap/bs-progress/BsProgressUsage.vue';
import BsTabsUsage from '@/components/bootstrap/bs-tabs/BsTabsUsage.vue';
import BsSwitchUsage from '@/components/bootstrap/bs-switch/BsSwitchUsage.vue';
import BsMessageBoxUsage from '@/components/bootstrap/bs-message-box/BsMessageBoxUsage.vue';
import BsMaskUsage from '@/components/bootstrap/bs-mask/BsMaskUsage.vue';
import BsAlertUsage from '@/components/bootstrap/bs-alert/BsAlertUsage.vue';
import BsInputNumberUsage from '@/components/bootstrap/bs-input-number/BsInputNumberUsage.vue';
import BsPopperUsage from '@/components/bootstrap/bs-popper/BsPopperUsage.vue';
import BsTooltipUsage from '@/components/bootstrap/bs-tooltip/BsTooltipUsage.vue';
import BsSliderUsage from '@/components/bootstrap/bs-slider/BsSliderUsage.vue';
import BsModalUsage from '@/components/bootstrap/bs-modal/BsModalUsage.vue';
import BsDrawerUsage from '@/components/bootstrap/bs-drawer/BsDrawerUsage.vue';
import BsPopoverUsage from '@/components/bootstrap/bs-popover/BsPopoverUsage.vue';
import BsSpinnerUsage from '@/components/bootstrap/bs-spinner/BsSpinnerUsage.vue';
import BsPopConfirmUsage from '@/components/bootstrap/bs-pop-confirm/BsPopConfirmUsage.vue';
import BsCollapseUsage from '@/components/bootstrap/bs-collapse/BsCollapseUsage.vue';
import BsTreeUsage from '@/components/bootstrap/bs-tree/BsTreeUsage.vue';
import BsTreeSelectUsage from '@/components/bootstrap/bs-tree-select/BsTreeSelectUsage.vue';
import BsInputTagsUsage from '@/components/bootstrap/bs-input-tags/BsInputTagsUsage.vue';
import BsSelectInputUsage from '@/components/bootstrap/bs-select-input/BsSelectInputUsage.vue';
import BsTimePickerUsage from '@/components/bootstrap/bs-time-picker/BsTimePickerUsage.vue';
import BsDatePickerUsage from '@/components/bootstrap/bs-date-picker/BsDatePickerUsage.vue';
import BsBackTopUsage from '@/components/bootstrap/bs-backtop/BsBackTopUsage.vue';
import BsRelativeTimeUsage from '@/components/bootstrap/bs-relative-time/BsRelativeTimeUsage.vue';
import BsLoadingUsage from '@/components/bootstrap/bs-loading/BsLoadingUsage.vue';
import BsCascaderUsage from '@/components/bootstrap/bs-cascader/BsCascaderUsage.vue';
import BsToastUsage from '@/components/bootstrap/bs-toast/BsToastUsage.vue';
import BsMenuUsage from '@/components/bootstrap/bs-menu/BsMenuUsage.vue';

export default defineComponent({
  name: 'App',
  /* eslint-disable */
  components: {
    // HelloWorld
    // AsyncValidatorUsage,
    BsFormUsage,
    BsButtonUsage,
    BsButtonGroupUsage,
    BsInputUsage,
    BsRadioUsage,
    BsRadioGroupUsage,
    BsCheckboxUsage,
    BsCheckboxGroupUsage,
    BsSelectUsage,
    BsDropdownUsage,
    BsPaginationUsage,
    BsBadgeUsage,
    BsMessageUsage,
    BsBreadcrumbUsage,
    BsTagUsage,
    BsProgressUsage,
    BsTabsUsage,
    BsSwitchUsage,
    BsMessageBoxUsage,
    BsMaskUsage,
    BsAlertUsage,
    BsInputNumberUsage,
    BsPopperUsage,
    BsTooltipUsage,
    BsSliderUsage,
    BsModalUsage,
    BsDrawerUsage,
    BsPopoverUsage,
    BsSpinnerUsage,
    BsPopConfirmUsage,
    BsCollapseUsage,
    BsTreeUsage,
    BsTreeSelectUsage,
    BsInputTagsUsage,
    BsSelectInputUsage,
    BsTimePickerUsage,
    BsDatePickerUsage,
    BsBackTopUsage,
    BsRelativeTimeUsage,
    BsLoadingUsage,
    BsCascaderUsage,
    BsToastUsage,
    BsMenuUsage
  },
  setup () {
    return {

    };
  }
});
</script>

<style lang="scss">
/*body{
  height: 2000px;
}*/
.box{
  padding: 20px;
}
.component-usage{
  h1,
  h2,
  h3,
  h4,
  /*h5,*/
  h6{
    margin-bottom: 1.5rem;
  }
}
</style>
