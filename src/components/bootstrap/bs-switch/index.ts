import BsSwitch from './BsSwitch.vue';

BsSwitch.install = function (vueApp: any) {
  vueApp.component(BsSwitch.name, BsSwitch);
  return vueApp;
};

export default BsSwitch;
