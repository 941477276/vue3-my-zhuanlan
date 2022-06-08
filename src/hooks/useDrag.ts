// 绑定事件
function _addEvent (el, eventName, fn) {
  if (document.addEventListener) {
    el.addEventListener(eventName, fn, false);
  } else if (window.attachEvent) {
    el.attactEvent('on' + eventName, fn);
  }
};

// 解绑事件
function _offEvent (el, eventName, fn) {
  if (document.removeEventListener) {
    el.removeEventListener(eventName, fn, false);
  } else if (window.detachEvent) {
    el.detachEvent('on' + eventName, fn);
  }
};
export default {
  bind (el, binding, vnode) {
    if (!binding.value.dragElSelector) {
      console.error('需传递拖拽元素的选择器，参数名：dragElSelector');
      return;
    }
    if (binding.value.useDrag === false) {
      return;
    }
    const dialogHeaderEl = el.querySelector(binding.value.dragElSelector);
    const dragDom = el;
    // 是否使用边界，如果使用边界则元素不会被拖出窗口
    const useBoundary = binding.value.useBoundary !== false;
    const onDrag = binding.value.onDrag;
    dialogHeaderEl.style.cssText += ';cursor:move;';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })();
    let mouseDownEvent = (e) => {
      // console.log(e.clientX, e.clientY)
      // console.log(vnode); // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
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
      let mouseMoveEvent = (e) => {
        e.preventDefault();
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;
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
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
        // 执行 onDrag 事件
        if (typeof onDrag === 'function') {
          onDrag();
        }
      };
      _addEvent(document, 'mousemove', mouseMoveEvent);
      let mouseUpEvent = function () {
        _offEvent(document, 'mousemove', mouseMoveEvent);
        _offEvent(document, 'mouseup', mouseUpEvent);
      };
      _addEvent(document, 'mouseup', mouseUpEvent);
    };
    _addEvent(dialogHeaderEl, 'mousedown', mouseDownEvent);
  }
};
