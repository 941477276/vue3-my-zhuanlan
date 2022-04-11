import BsTag from './BsTag.vue';

BsTag.install = function (vueApp: any) {
  vueApp.component(BsTag.name, BsTag);
};

export default BsTag;
