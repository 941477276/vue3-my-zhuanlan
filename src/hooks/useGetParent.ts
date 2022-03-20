import { ComponentInternalInstance, ref, onUpdated, getCurrentInstance, Ref, computed } from 'vue';

/**
 * 获取当前组件指定类型的父组件
 * @param parentComponentName 父组件名称
 */
export function useGetParent (parentComponentName: string): Ref<ComponentInternalInstance|null> {
  let getParent = function () {
    // console.log('useGetParent');
    let parent = (getCurrentInstance() as ComponentInternalInstance).parent;
    while (parent && parent?.type.name !== parentComponentName) {
      parent = parent?.parent || null;
    }
    return parent;
  };
  // 这里不能使用onUpdated钩子来获取父组件，会出现无限循环触发onUpdated钩子问题
  let $parent = computed<ComponentInternalInstance|null>(function () {
    return getParent();
  });

  return $parent;
}
