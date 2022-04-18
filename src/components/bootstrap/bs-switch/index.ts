import BsSwitch from './BsSwitch.vue';

BsSwitch.install = function (vueApp: any) {
  vueApp.component(BsSwitch.name, BsSwitch);
};

export default BsSwitch;
