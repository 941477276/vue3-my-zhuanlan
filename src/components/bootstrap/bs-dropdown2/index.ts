import BsDropdown from './BsDropdown.vue';
import BsDropdownItem from './widgets/BsDropdownItem.vue';

BsDropdown.install = function (vueApp: any) {
  vueApp.component(BsDropdown.name, BsDropdown);
  vueApp.component(BsDropdownItem.name, BsDropdownItem);
};

export default BsDropdown;
