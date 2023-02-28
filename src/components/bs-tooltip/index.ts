import BsTooltip from './BsTooltip.vue';

BsTooltip.install = function (vueApp: any) {
  vueApp.component(BsTooltip.name, BsTooltip);
  return vueApp;
};

export default BsTooltip;
