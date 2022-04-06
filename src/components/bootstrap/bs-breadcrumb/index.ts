import BsBreadcrumb from './BsBreadcrumb.vue';
import BreadcrumbItem from './widgets/Breadcrumb-item.vue';

export default {
  installed: false,
  install (app: any) {
    if (this.installed) {
      return;
    }
    app.component(BsBreadcrumb.name, BsBreadcrumb);
    app.component(BreadcrumbItem.name, BreadcrumbItem);
    this.installed = true;
  }
};
