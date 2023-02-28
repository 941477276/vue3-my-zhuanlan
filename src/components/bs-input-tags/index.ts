import BsInputTags from './BsInputTags.vue';

BsInputTags.install = function (vueApp: any) {
  vueApp.component(BsInputTags.name, BsInputTags);
  return vueApp;
};

export default BsInputTags;
