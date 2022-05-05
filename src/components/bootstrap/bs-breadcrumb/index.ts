import BsBreadcrumb from './BsBreadcrumb.vue';
import BreadcrumbItem from './widgets/Breadcrumb-item.vue';

export default {
  installed: false,
  install (vueApp: any) {
    if (this.installed) {
      return;
    }
    vueApp.component(BsBreadcrumb.name, BsBreadcrumb);
    vueApp.component(BreadcrumbItem.name, BreadcrumbItem);
    this.installed = true;
    return vueApp;
  }
};
