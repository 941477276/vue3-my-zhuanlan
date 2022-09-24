export interface ToastCtx {
  show: () => void;
  hide: () => void;
}
// 存储toast的上下文
let toastCtxs: { [key:string]: ToastCtx } = {};
// 存储fixed定位且已显示的toast id（主要是计算toast的位置使用）
let fixedToastIdMap: { [key: string]: string[] } = {};

// 存储toast上下文
export function addToastCtx (toastId: string, toastCtx: ToastCtx) {
  if (toastId in toastCtxs) {
    console.warn(`The later toast with the same ID will overwrite the previous one!(ID: ${toastId})`);
  }
  toastCtxs[toastId] = toastCtx;
  console.log('addToastCtx', toastCtxs);
};

// 移除toast上下文
export function removeToastCtx (toastId: string) {
  delete toastCtxs[toastId];
  console.log('removeToastCtx', toastCtxs);
};

// 获取toast上下文
export function getToastCtx (toastId: string) {
  return toastCtxs[toastId];
};

export function addFixedToastId (toastId: string, placement: string) {
  if (!(placement in fixedToastIdMap)) {
    fixedToastIdMap[placement] = [];
  }
  fixedToastIdMap[placement].push(toastId);
};

export function removeFixedToastId (toastId: string, placement: string) {
  if (!(placement in fixedToastIdMap)) {
    return;
  }
  let ids = fixedToastIdMap[placement];
  let index = ids.findIndex(idItem => idItem === toastId);
  if (index > -1) {
    ids.splice(index, 1);
  }
};

export function getFixedToastIdsByPlacement (placement: string) {
  return fixedToastIdMap[placement] || [];
}

// 允许的显示方位
export const allowedPlacements = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'];
