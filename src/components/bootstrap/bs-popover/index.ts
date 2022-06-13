import BsPopover from './BsPopover.vue';

BsPopover.install = function (vueApp: any) {
  vueApp.component(BsPopover.name, BsPopover);
  return vueApp;
};

export default BsPopover;
