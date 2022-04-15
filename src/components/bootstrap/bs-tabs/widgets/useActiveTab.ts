import {
  onMounted,
  onUnmounted,
  ref,
  watch,
  Ref
} from 'vue';

let getPaneByName = function (name: string, panes: any[]) {
  return panes.find((pane: {[key: string]: any}) => {
    return pane.name === name;
  });
};
/* let getPaneById = function (id: string, panes: any[]) {
  return panes.find((pane: {[key: string]: any}) => {
    return pane.id === id;
  });
}; */

export function useActiveTab (props: any, tabsNavRef: Ref<HTMLElement|null>, inkBarRef: Ref<HTMLElement|null>): any {
  // 激活的tab
  let activeTabId = ref('');
  let onNavItemClick = function (tab: { id: string; name: string; }) {
    console.log('onNavItemClick', tab);
    activeTabId.value = tab.id;
  };

  let stopWatchActiveTabName = watch(() => props.activeTabName, function (newActiveTabName: string) {
    let activeTab = getPaneByName(newActiveTabName, props.panes);
    if (activeTab) {
      if (activeTab.id === activeTabId.value) {
        return;
      }
      activeTabId.value = activeTab.id;
    } else {
      activeTabId.value = '';
    }
  });

  onMounted(function () {
    let tab = getPaneByName(props.activeTabName, props.panes);
    if (!tab) {
      tab = props.panes[0];
    }
    activeTabId.value = tab.id;
  });
  onUnmounted(function () {
    stopWatchActiveTabName();
  });

  return {
    activeTabId,
    onNavItemClick
  };
};
