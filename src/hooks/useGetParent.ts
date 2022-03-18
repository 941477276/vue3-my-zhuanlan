import { ComponentInternalInstance, ref, onUpdated, getCurrentInstance, Ref } from 'vue';

/**
 * 获取当前组件指定类型的父组件
 * @param parentComponentName 父组件名称
 */
export function useGetParent (parentComponentName: string): Ref<ComponentInternalInstance|null> {
  let $parent = ref<ComponentInternalInstance|null>(null);
  if (!parentComponentName) {
    return $parent;
  }
  let getParent = function () {
    $parent.value = (getCurrentInstance() as ComponentInternalInstance).parent;
    while ($parent.value && $parent.value?.type.name !== parentComponentName) {
      $parent.value = $parent.value?.parent || null;
    }
  };
  getParent();
  onUpdated(getParent);

  return $parent;
}
