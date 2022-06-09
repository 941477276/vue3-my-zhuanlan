function drag (el: HTMLElement, binding: any) {
  const dialogHeaderEl = el.querySelector(binding.value.dragBar);
  const dragDom = el.querySelector(binding.value.target);
  // 是否使用边界，如果使用边界则元素不会被拖出窗口
  const useBoundary = binding.value.useBoundary !== false;
  const onDrag = binding.value.onDrag;
  // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
  const getStyle = (function () {
    if ((window.document as any).currentStyle) {
      return (dom: HTMLElement|any, attr: string) => dom.currentStyle[attr];
    } else {
      // @ts-ignore
      return (dom: HTMLElement, attr: string) => getComputedStyle(dom, null)[attr];
    }
  })();
  if ((el as any).dragInited) { // 已经开启过了拖拽功能，需防止重复开启（指令mounted、update都会进来）
    if (!binding.value.useDrag) {
      console.log('禁用了拖拽', dialogHeaderEl.bs_mouseDown);
      dialogHeaderEl.style.cursor = '';
      dialogHeaderEl.removeEventListener('mousedown', dialogHeaderEl.bs_mouseDown, false);
      dialogHeaderEl.bs_mouseDown = null;
      (el as any).dragInited = false;
      return;
    } else {
      console.log('指令已经初始化过了，无需重复初始化');
      return;
    }
  } else {
    if (!binding.value.useDrag) {
      return;
    }
  }
  console.log('指令初始化了');
  dialogHeaderEl.style.cursor = 'move';
  (el as any).dragInited = true;
  let mouseDownEvent = (evt: MouseEvent) => {
    if (binding.value.useDrag === false) {
      return;
    }
    // console.log(evt.clientX, evt.clientY);
    // console.log(vnode); // 鼠标按下，计算当前元素距离可视区的距离
    const disX = evt.clientX - dialogHeaderEl.offsetLeft;
    const disY = evt.clientY - dialogHeaderEl.offsetTop;
    const dragDomWidth = dragDom.offsetWidth;
    const dragDomHeight = dragDom.offsetHeight;
    const screenWidth = document.body.clientWidth || window.innerWidth;
    const screenHeight = document.body.clientHeight || window.innerHeight;
    const minDragDomLeft = dragDom.offsetLeft;
    const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
    const minDragDomTop = dragDom.offsetTop;
    const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;
    // console.log('minDragDomTop', minDragDomTop, maxDragDomTop)
    // console.log('screenHeight', screenHeight) // 获取到的值带px 正则匹配替换
    let styL = getStyle(dragDom, 'left');
    let styT = getStyle(dragDom, 'top');

    if (styL.includes('%')) {
      styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100);
      styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100);
    } else {
      styL = +styL.replace(/px/g, '');
      styT = +styT.replace(/px/g, '');
    }
    let mouseMoveEvent = (e: MouseEvent) => {
      e.preventDefault();
      // 通过事件委托，计算移动的距离
      let left = e.clientX - disX;
      let top = e.clientY - disY;
      // console.log('mouseMoveEvent1', top, left, e.clientX, e.clientY);
      if (useBoundary) {
        // 边界处理
        if (-(left) > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }
        // console.log('top maxDragDomTop', top, maxDragDomTop)
        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }
      }

      // 移动当前元素
      dragDom.style.left = `${left + styL}px`;
      dragDom.style.top = `${top + styT}px`;
      // 执行 onDrag 事件
      if (typeof onDrag === 'function') {
        onDrag();
      }
    };

    let mouseUpEvent = function () {
      document.removeEventListener('mousemove', mouseMoveEvent, false);
      document.removeEventListener('mouseup', mouseUpEvent, false);
    };
    document.addEventListener('mousemove', mouseMoveEvent, false);
    document.addEventListener('mouseup', mouseUpEvent, false);
    document.addEventListener('mouseleave', mouseUpEvent, false);
  };

  dialogHeaderEl.addEventListener('mousedown', mouseDownEvent, false);
  dialogHeaderEl.bs_mouseDown = mouseDownEvent;
};

export default {
  mounted (el: HTMLElement, binding: any) {
    if (!binding.value.dragBar) {
      console.error('需传递拖拽元素的选择器，参数名：dragBar');
      return;
    }
    if (!binding.value.target) {
      console.error('需传递被拖拽元素的选择器，参数名：target');
      return;
    }
    if (binding.value.useDrag === false) {
      return;
    }
    // console.log('drag指令注册了');
    drag(el, binding);
    // (el as any).dragInited = true;
  },
  updated (el: HTMLElement, binding: any) {
    // console.log('updated', el, binding);
    drag(el, binding);
  }
};
