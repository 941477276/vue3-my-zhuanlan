import BsInput from './BsInput.vue';
import InputText from './widgets/InputeText';

BsInput.install = function (vueApp: any) {
  vueApp.component(BsInput.name, BsInput);
  vueApp.component('BsInputText', InputText);
  return vueApp;
};

export default BsInput;
