/* tslint:disable */
/* eslint-disable */
var tool = {
  // 获取浏览器宽高
  getDocumentWidthHeight () {
    if (window.innerHeight != null) {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    } else if (document.compatMode === 'CSS1Compat') {
      // 怪异模式浏览器
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      };
    }
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    };
  },
  /**
   * 获取元素距浏览器最顶部及最左边的距离
   * @param ele dom元素
   */
  offset (ele) {
    var positon = {
      top: 0,
      left: 0
    };
    var offsetParent = ele.offsetParent;
    positon.top = ele.offsetTop;
    positon.left = ele.offsetLeft;
    while (offsetParent != null) {
      positon.top += offsetParent.offsetTop;
      positon.left += offsetParent.offsetLeft;
      offsetParent = offsetParent.offsetParent;
    }
    return positon;
  },
  /**
   * 获取浏览器垂直滚动条的位置
   */
  scrollTop () {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  },
  /**
   * 获取浏览器水平滚动条的位置
   */
  scrollLeft () {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  },
  /**
   * 给指定元素添加class
   * @param ele
   * @param classname
   */
  addClass (ele, classname) {
    if (!ele || !classname || ele.nodeType !== 1) {
      return;
    }
    var classArr = classname.split(' ');
    if (ele.classList) {
      for (var i = 0, len = classArr.length; i < len; i++) {
        var item = classArr[i];
        if (!ele.classList.contains(item)) {
          ele.classList.add(item);
        }
      }
      return ele;
    } else {
      var classNameArr = ele.className && ele.className.length > 0 ? ele.className.split(' ') : [];
      if (classNameArr.length === 0) {
        ele.className = classname;
        return;
      }
      // 合并两个数组
      Array.prototype.push.apply(classNameArr, classArr);
      classNameArr = tool.arrayNoReapeat(classNameArr);
      ele.className = classNameArr.join(' ');
      return ele;
    }
  },
  /**
   * 数组去重
   * @param arr 需要去重的数组
   * @param isObjectValue 数组的值是否是引用类型
   */
  arrayNoReapeat (arr, isObjectValue) {
    if (!arr || arr.length === 0) {
      return arr;
    }
    isObjectValue = typeof isObjectValue === 'undefined' ? false : !!isObjectValue;
    var arrLen = arr.length;
    let newArr = [];
    // 值类型的数组，使用对象属性唯一的特性来去重
    if (!isObjectValue) {
      var obj = {};
      for (var i = 0; i < arrLen; i++) {
        obj[arr[i]] = 1;
      }
      for (var attr in obj) {
        newArr.push(attr);
      }
      return newArr;
    }

    newArr.push(arr[0]);
    for (var i = 1; i < arrLen; i++) {
      let item = arr[i];
      let repeat = false;
      for (var j = 0; j < newArr.length; j++) {
        if (item === arr[j]) {
          repeat = true;
          break;
        }
      }
      if (!repeat) {
        newArr.push(item);
      }
    }
    return newArr;
  },
  /**
   * 给指定元素移除class
   * @param ele
   * @param classname
   */
  removeClass (ele, classname) {
    if (!ele || !classname || ele.nodeType !== 1) {
      return;
    }
    var classArr = classname.split(' ');
    if (ele.classList) {
      for (var i = 0, len = classArr.length; i < len; i++) {
        var item = classArr[i];
        if (ele.classList.contains(item)) {
          ele.classList.remove(item);
        }
      }
      return ele;
    } else {
      var classNameArr = ele.className && ele.className.length > 0 ? ele.className.split(' ') : [];
      if (classNameArr.length === 0) {
        return;
      }
      for (var i = classNameArr.length; i >= 0; i--) {
        for (var j = 0, len2 = classArr.length; j < len2; j++) {
          if (classNameArr[i] === classArr[j]) {
            classNameArr.splice(i, 1);
          }
        }
      }
      ele.className = classNameArr.join(' ');
      return ele;
    }
  },
  /**
   * 判断元素是否包含指定className
   * @param ele dom元素
   * @param className className
   * @returns {boolean}
   */
  hasClass (ele, className) {
    if (!ele || !ele.nodeName) {
      console.error('ele 必须是一个dom元素');
      return
    }
    if (!className) {
      console.error('className 必须是一个字符串');
      return
    }
    if (ele.classList) {
      return ele.classList.contains(className);
    } else {
      var flag = false
      var classNameArr = ele.className.split(' ');
      for (var i = 0, len = classNameArr.length; i < len; i++) {
        if (classNameArr[i] === className) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  },
  /**
   * 获取元素的css属性值
   * @param ele dom元素
   * @param cssAttribute css属性名称
   */
  getStyle (ele, cssAttribute) {
    if (!ele || !ele.nodeName) {
      console.error('ele 必须是一个dom元素');
      return;
    }
    if (!cssAttribute) {
      console.error('cssAttribute 必须是一个字符串');
      return;
    }
    var val = '';
    if (window.getComputedStyle) {
      val = window.getComputedStyle(ele, null)[cssAttribute];
    } else if (ele.currentStyle) {
      val = ele.currentStyle[cssAttribute];
    }
    if (!isNaN(parseFloat(val))) {
      return parseFloat(val);
    } else {
      return val;
    }
  },
  /**
   * 给元素设置css属性
   * @param ele dom元素
   * @param attr css属性名
   * @param val css属性值，如果不传递attr参数，则该参数可以为一个对象，就像jquery的css()方法一样
   */
  setCss (ele, attrs, val) {
    if (!ele || !ele.nodeName) {
      console.error('ele 必须是一个dom元素');
      return;
    }
    var type1 = ({}).toString.call(attrs);
    // 需要字段加单位的css属性
    var autoAddUnitAttr = {
      width: 1,
      height: 1,
      margin: 1,
      padding: 1,
      borderRadius: 1,
      top: 1,
      left: 1,
      marginLeft: 1,
      marginRight: 1,
      marginTop: 1,
      marginBottom: 1,
      right: 1,
      bottom: 1,
      paddingLeft: 1,
      paddingRight: 1,
      paddingTop: 1,
      paddingBottom: 1,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
      borderBottomLeftRadius: 1,
      borderBottomRightRadius: 1,
      fontSize: 1,
      lineHeight: 1,
      textIndent: 1,
      minWidth: 1,
      maxWith: 1,
    };
    if (type1 === '[object String]' && typeof val !== 'undefined') {
      attrs = attrs.replace(/\-(\w)/g, function (matched, $1) {
        return $1.toUpperCase();
      })
      if (attrs in autoAddUnitAttr && !isNaN(Number(val))) {
        ele.style[attrs] = val + 'px';
      } else {
        ele.style[attrs] = val;
      }
    } else if (type1 === '[object Object]') {
      var style = ele.style;
      for (var attr in attrs) {
        var val2 = attrs[attr];
        var isNumber = Number(val2);

        attr = attr.replace(/\-(\w)/g, function (matched, $1) {
          return $1.toUpperCase();
        });

        if (attr in autoAddUnitAttr && !isNaN(isNumber)) {
          style[attr] = val2 + 'px';
        } else {
          style[attr] = val2;
        }
      }
    }
    return this;
  },
  /**
   * 获取兄弟节点
   * @param elm
   * @returns {Array}
   */
  siblings (elm) {
    var a = [];
    var p = elm.parentNode.children;
    for (var i = 0, pl = p.length; i < pl; i++) {
      if (p[i] !== elm) a.push(p[i]);
    }
    return a;
  },
  /**
   * 判断两个元素是否是包含关系
   * @param ele 父元素
   * @param childEle 子元素
   * @returns {Boolean}
   */
  elementContains (ele, childEle) {
    if (ele === childEle) {
      return false;
    }
    if (typeof ele.contains === 'function') {
      return ele.contains(childEle);
    } else {
      while (true) {
        if (!childEle) {
          return false;
        }
        if (childEle === ele) {
          return true;
        } else {
          childEle = childEle.parentNode;
        }
      }
      return false;
    }
  },

  /**
   * 获取数组中符合条件的元素的索引
   * @param arr 数组
   * @param fn 一个函数，如果函数返回true，则返回该项的下标，如果没有找到则返回-1
   */
  getIndex (arr, fn) {
    if (!arr || arr.length === 0 || !fn || (typeof fn !== 'function')) {
      return -1;
    }

    if (arr.findIndex) {
      return arr.findIndex(fn);
    }
    var len = arr.length;
    var i = 0;
    var index = -1;
    for (; i < len; i++) {
      var item = arr[i];
      if (fn(item, index, arr) === true) {
        index = i;
        break;
      }
    }
    return index;
  },
  /**
   * 对象/数组拷贝，支持深拷贝（jQuery代码）
   * @returns {any}
   */
  extend: function () {
    var isFunction = function isFunction (obj) {
      return typeof obj === 'function' && typeof obj.nodeType !== 'number';
    };
    var isPlainObject = function (obj) {
      var proto, Ctor;
      // Detect obvious negatives
      // Use toString instead of jQuery.type to catch host objects
      if (!obj || toString.call(obj) !== '[object Object]') {
        return false;
      }
      proto = Object.getPrototypeOf(obj);
      // Objects with no prototype (e.g., `Object.create( null )`) are plain
      if (!proto) {
        return true;
      }
      // Objects with prototype are plain iff they were constructed by a global Object function
      Ctor = ({}).hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor === 'function' && ({}).toString.call(Ctor) === ({}).toString.call(Object);
    }
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;

      // Skip the boolean and the target
      target = arguments[i] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !isFunction(target)) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {

      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {

        // Extend the base object
        for (name in options) {
          copy = options[name];

          // Prevent Object.prototype pollution
          // Prevent never-ending loop
          if (name === '__proto__' || target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (isPlainObject(copy) ||
            (copyIsArray = Array.isArray(copy)))) {
            src = target[name];

            // Ensure proper type for the source value
            if (copyIsArray && !Array.isArray(src)) {
              clone = [];
            } else if (!copyIsArray && !isPlainObject(src)) {
              clone = {};
            } else {
              clone = src;
            }
            copyIsArray = false;

            // Never move original objects, clone them
            target[name] = tool.extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  },

  /**
   * 判断对象是否是一个空对象
   * @param obj
   */
  isEmptyObject (obj) {
    for (var attr in obj) {
      return false;
    }
    return true;
  },
  /**
   * 获取元素的指定父级元素
   * @param el dom 元素
   * @param className 父元素的class name
   * @returns {dom、undefined}
   */
  parents (el, className) {
    if (!el || !el.nodeName || !className) {
      return;
    }
    var classNameArr = className.split(' ');
    var parent = el.parentElement;

    while (parent) {
      var flag = true;
      for (var i = 0, len = classNameArr.length; i < len; i++) {
        if (!this.hasClass(parent, classNameArr[i])) {
          flag = false;
          break;
        }
      }
      if (flag) {
        return parent;
      } else {
        parent = parent.parentElement;
      }
    }
  },
  /**
   * 获取变量的数据类型
   * @param obj
   * @returns {string|string|"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
   */
  getType: function (obj) {
    var class2type = {};
    if (obj == null) {
      return obj + '';
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
  }
};
export default tool;
export { tool as util };
