import {
  Ref,
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue';
import {
  HiddenTabInfo
} from '@/ts-tokens/bootstrap/tabs';
import { util } from '@/common/util';

let getPaneById = function (id: string, panes: any[]) {
  return panes.find((pane: {[key: string]: any}) => {
    return pane.id === id;
  });
};

let getOffsetInfo = function (navItemEl: HTMLElement, navScrollerEl: HTMLElement) {
  let navItemOffsetLeft = navItemEl.offsetLeft;
  let navItemOffsetTop = navItemEl.offsetTop;
  return {
    navItemOffsetLeft,
    navItemOffsetTop,
    navItemOffsetRight: navItemOffsetLeft + navItemEl.offsetWidth,
    navItemOffsetBottom: navItemOffsetTop + navItemEl.offsetHeight,
    navScrollerWidth: navScrollerEl.offsetWidth,
    navScrollerHeight: navScrollerEl.offsetHeight
  };
};

// 移动标签导航高亮条
function moveInkBar (tabPositionIsHorizontal: boolean, inkBarSpaceBetween: number, inkBarEl: HTMLElement, activeTabEl: HTMLElement) {
  if (tabPositionIsHorizontal) {
    inkBarEl.style.left = (activeTabEl.offsetLeft - inkBarSpaceBetween) + 'px';
    inkBarEl.style.width = activeTabEl.offsetWidth + (inkBarSpaceBetween * 2) + 'px';
    inkBarEl.style.top = '';
    inkBarEl.style.height = '';
  } else {
    inkBarEl.style.top = (activeTabEl.offsetTop - inkBarSpaceBetween) + 'px';
    inkBarEl.style.height = activeTabEl.offsetHeight + (inkBarSpaceBetween * 2) + 'px';
    inkBarEl.style.left = '';
    inkBarEl.style.width = '';
  }
}

export function useTabsNavMove (props: any, navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>, inkBarRef: Ref<HTMLElement|null>, activeTabId: Ref<string>, hiddenTabs: Ref<HiddenTabInfo[]>) {
  let stopWatchActiveTabId = watch(activeTabId, function () {
    nextTick(function () {
      let activeTabIdVal = activeTabId.value;
      if (!activeTabIdVal) {
        return;
      }
      let tabsNavEl = tabsNavRef.value as HTMLElement;
      // 当前激活的标签导航元素
      let activeTabEl = tabsNavEl?.querySelector(`[data-tabs-nav-item-id=${activeTabIdVal}]`) as HTMLElement;
      let inkBarEl = inkBarRef.value as HTMLElement;
      if (!activeTabEl) {
        return;
      }
      // 判断元素在父容器中是否完全可见
      let elIsFullView = util.eleInParentFullView(activeTabEl, navScrollerRef.value as HTMLElement);
      let tabPositionIsHorizontal = props.tabPosition === 'top' || props.tabPosition === 'bottom';
      console.log('activeTabEl', activeTabEl, elIsFullView, activeTabEl.offsetLeft, props.tabPosition);

      if (tabPositionIsHorizontal) {
        // 元素在水平方向完全可见，则不做任何操作
        if (!elIsFullView.horizontal) {
          let offsetInfo = getOffsetInfo(activeTabEl, navScrollerRef.value as HTMLElement);
          let translateX = 0;
          if (offsetInfo.navItemOffsetLeft > 0) {
            console.log('navItemOffsetRight', offsetInfo.navItemOffsetLeft, offsetInfo.navItemOffsetRight, offsetInfo.navScrollerWidth);
            translateX = offsetInfo.navItemOffsetRight - offsetInfo.navScrollerWidth;
          } else {
            translateX = 0;
          }
          console.log('translateX', translateX);
          tabsNavEl.style.transform = `translate(${-translateX}px, 0)`;
        }
      } else {
        if (!elIsFullView.vertical) {
          let offsetInfo = getOffsetInfo(activeTabEl, navScrollerRef.value as HTMLElement);
          let translateY = 0;
          if (offsetInfo.navItemOffsetTop > 0) {
            translateY = offsetInfo.navItemOffsetBottom - offsetInfo.navScrollerHeight;
          } else {
            translateY = 0;
          }
          console.log('translateY', translateY);
          tabsNavEl.style.transform = `translate(${-translateY}px, 0)`;
        }
      }

      // 移动标签导航高亮条
      moveInkBar(tabPositionIsHorizontal, props.inkBarSpaceBetween, inkBarEl, activeTabEl);
    });
  }, { immediate: true });

  onUnmounted(function () {
    stopWatchActiveTabId();
  });
};
