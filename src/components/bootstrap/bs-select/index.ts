import BsSelect from './BsSelect.vue';
import BsOption from './widgets/BsOption.vue';
import BsOptionGroup from './widgets/BsOptionGroup.vue';

BsSelect.install = function (vueApp: any) {
  vueApp.component(BsSelect.name, BsSelect);
  vueApp.component(BsOption.name, BsOption);
  vueApp.component(BsOptionGroup.name, BsOptionGroup);
};

export default BsSelect;
