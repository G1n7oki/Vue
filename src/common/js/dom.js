/**
 * hasClassName
 *
 * @param el: 增加类名的dom
 * @param className: dom增加的类名
 * @returns {boolean}
 */
export function hasClassName(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

/**
 * addClass
 *
 * @param el: 需要增加类名的dom
 * @param className: dom增加的类名
 */

export function addClass(el, className) {
  if (hasClassName(el, className)) {
    return;
  }
  // 不知道为什要这样写
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join('');

  // 效果是一样的
  // el.className = className;
}

/**
 * getDate
 *
 * @param el: 当前元素
 * @param name: 获取或设置属性名称
 * @param val: 改变的值
 * @returns {*}
 */

export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;

  if (val) {
    return el.setAttribute(name, val);
  }else {
    return el.getAttribute(name);
  }
}

let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
