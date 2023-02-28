import BsSlider from './BsSlider.vue';

BsSlider.install = function (vueApp: any) {
  vueApp.component(BsSlider.name, BsSlider);

  return BsSlider;
};

export default BsSlider;
