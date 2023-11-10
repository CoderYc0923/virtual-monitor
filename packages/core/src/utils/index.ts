import { AnyFun, AnyObj } from "../types";
import { isInit } from "./global";
import { isRegExp, isArray, isFunction, isNumber } from "./is";
import { logError } from "./debug";

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
        target[key] = source[key];
      }
    }
  });
  return target as T;
}

//判断入参类型
export function typeofAny(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

//判断对象中是否包含该属性
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

//节流
export function throttle(func: AnyFun, wait: number, runFirst = false) {
  let timer: NodeJS.Timeout | null = null;
  let lastArgs: any[];

  return function (this: any, ...args: any[]) {
    lastArgs = args;
    if (timer === null) {
      if (runFirst) {
        func.apply(this, lastArgs);
      }
      timer = setTimeout(() => {
        timer = null;
        func.apply(this, lastArgs);
      }, wait);
    }
  };
}

//防抖
export function debounce(func: AnyFun, wait: number, runFirst = false) {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    if (runFirst) {
      func.call(this, ...args);
      runFirst = false;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.call(this, ...args);
    }, wait);
  };
}

const arrayMap =
  Array.prototype.map ||
  function polyfillMap(this: any, fn) {
    const res = [];
    for (let i = 0; i < this.length; i++) {
      res.push(fn(this[i], i, this));
    }
    return res;
  };

//map
export function useMap(arr: any[], fn: AnyFun) {
  return arrayMap.call(arr, fn);
}

const arrayFilter =
  Array.prototype.filter ||
  function filterPolyfill(this: any, fn: AnyFun) {
    const result = [];
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };

//filter
export function useFilter(arr: any[], fn: AnyFun) {
  return arrayFilter.call(arr, fn);
}

//批量执行方法
export function executeFunctions(
  funcList: AnyFun[],
  argsThroughAll: boolean,
  args: any
) {
  if (funcList.length === 0) return args;
  let res: any = undefined;
  for (let i = 0; i < funcList.length; i++) {
    const func = funcList[i];
    if (i === 0 || argsThroughAll) res = func(args);
    else res = func(res);
  }
  return res;
}

//通过sendBeacon发送埋点数据
export function sendByBeacon(url: string, data: any) {
  return navigator.sendBeacon(url, JSON.stringify(data));
}

export const sendReaconImageList: any[] = [];

//通过image发送埋点数据
export function sendByImage(url: string, data: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`;
    sendReaconImageList.push(img);
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

//通过xml发送埋点数据
export function sendByXML(url: string, data: string): Promise<void> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("post", url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) resolve();
    };
  });
}

const wait = 17;

//异步执行
export const useNextTick =
  window.requestIdleCallback ||
  window.requestAnimationFrame ||
  ((callback) => setTimeout(callback, wait));

//以数组内某些属性为基础将数组分类
export function groupArray<T, K extends keyof T>(
  arr: T[],
  ...keys: K[]
): T[][] {
  const groups = new Map<string, T[]>();
  for (const obj of arr) {
    const key = keys
      .filter((k) => obj[k])
      .map((k) => obj[k])
      .join(":");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(obj);
  }
  return Array.from(groups.values());
}

//随机概率通过
export function randomBoolean(random: number) {
  return Math.random() <= random;
}

//获取当前页面url
export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return '未获取到url'
  return document.location.href
}

//验证调用向外暴露的方法时virtual-monitor是否初始化了
export function validateMethods(methodName: string): boolean {
  if (!isInit()) {
    logError(`virtual-monitor未初始化，${methodName}调用失败`)
    return false
  }
  return true
}