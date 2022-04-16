import {
  onMounted,
  onUnmounted,
  ref,
  watch,
  Ref
} from 'vue';
import {
  PaneItem
} from '@/ts-tokens/bootstrap/tabs';

let getPaneByName = function (name: string, panes: PaneItem[]) {
  return panes.find((pane: PaneItem) => {
    return pane.name === name;
  });
};
let getPaneById = function (id: string, panes: PaneItem[]) {
  return panes.find((pane: PaneItem) => {
    return pane.id === id;
  });
};

export function useActiveTab (props: any, ctx: any, tabsNavRef: Ref<HTMLElement|null>, inkBarRef: Ref<HTMLElement|null>): any {
  // 激活的tab
  let activeTabId = ref('');
  let onNavItemClick = function (tab: { id: string; name: string; }) {
    console.log('onNavItemClick', tab);
    activeTabId.value = tab.id;
    ctx.emit('click', tab);
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

  let stopWatchActiveTabId = watch(activeTabId, function (newActiveId, oldActiveId) {
    if (newActiveId === oldActiveId) {
      return;
    }
    let activeTab = getPaneById(newActiveId, props.panes);
    ctx.emit('changeActiveTab', activeTab);
  });

  onMounted(function () {
    let tab = getPaneByName(props.activeTabName, props.panes) as PaneItem;
    if (!tab) {
      tab = props.panes[0];
    }
    activeTabId.value = tab.id;
  });
  onUnmounted(function () {
    stopWatchActiveTabName();
    stopWatchActiveTabId();
  });

  return {
    activeTabId,
    onNavItemClick
  };
};
