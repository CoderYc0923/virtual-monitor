import { AnyFun, AnyObj } from "../types";
import { isRegExp, isArray, isFunction, isNumber } from "./is";

//添加事件监听器
export function on(
  target: Window | Document,
  eventName: string,
  handler: AnyFun,
  options = false
): void {
  target.addEventListener(eventName, handler, options);
}

//覆写对象原型链上的某个属性
export function replaceAop(
  source: AnyObj,
  name: string,
  repalacement: AnyFun,
  isForced = false
): void {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = repalacement(original);
    if (isFunction(wrapped)) {
      source[name] = wrapped;
    }
  }
}

//获取cookie中目标name的值
export function getCookieByName(name: string) {
  const result = document.cookie.match(new RegExp(`${name}=([^;]+)(;|$)`));
  return result ? result[1] : undefined;
}

//补全字符
export function pad(num: number, len: number, placeholder = "0") {
  const str = String(num);
  if (str.length < len) {
    let result = str;
    for (let i = 0; i < len - str.length; i++) {
      result = placeholder + result;
    }
    return result;
  }
  return str;
}

//获取一个随机字符串
export function uuid() {
  const date = new Date();
  // yyyy-MM-dd的16进制表示,7位数字
  const hexDate = parseInt(
    `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(
      date.getDate(),
      2
    )}`,
    10
  ).toString(16);

  // hh-mm-ss-ms的16进制表示，最大也是7位
  const hexTime = parseInt(
    `${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(
      date.getSeconds(),
      2
    )}${pad(date.getMilliseconds(), 3)}`,
    10
  ).toString(16);

  // 第8位数字表示后面的time字符串的长度
  let guid = hexDate + hexTime.length + hexTime;

  // 补充随机数，补足32位的16进制数
  while (guid.length < 32) {
    guid += Math.floor(Math.random() * 16).toString(16);
  }

  // 分为三段，前两段包含时间戳信息
  return `${guid.slice(0, 8)}-${guid.slice(8, 16)}-${guid.slice(16)}`;
}

//获取当前时间戳
export function getTimestamp(): number {
  return Date.now();
}

//深度合并对象
export function deepAssign<T>(target: AnyObj, ...sources: AnyObj[]) {
  sources.forEach((source) => {
    for (const key in source) {
      if (source[key] !== null && isRegExp(source[key])) {
        target[key] = source[key];
      } else if (source[key] !== null && typeof source[key] === "object") {
        //若当前是一个对象或者数组，递归
        target[key] = deepAssign(
          target[key] || (isArray(source[key]) ? [] : {}),
          source[key]
        );
      } else {
        //否则直接赋值
        target[key] = source[key]
      }
    }
  });
  return target as T
}

//判断入参类型
export function typeofAny(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}
