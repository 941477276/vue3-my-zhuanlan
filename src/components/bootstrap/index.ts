import BsButton from './bs-button/BsButton.vue';
import BsDropdown from './bs-dropdown/BsDropdown.vue';
import BsDropdownItem from './bs-dropdown-item/BsDropdownItem.vue';

export default function (vueApp: any) {
  vueApp.component(BsButton.name, BsButton);
  vueApp.component(BsDropdown.name, BsDropdown);
  vueApp.component(BsDropdownItem.name, BsDropdownItem);
}
