import BsRadio from './BsRadio.vue';

BsRadio.install = function (vueApp: any) {
  vueApp.component(BsRadio.name, BsRadio);
  return vueApp;
};

export default BsRadio;
