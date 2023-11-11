import { isWindow } from "./is";
import { VirtualMonitor } from "../types";

//是否是浏览器环境
export const isBrowserEnv = isWindow(
  typeof window !== "undefined" ? window : 0
);

//获取全局变量
export function getGlobal(): Window {
  if (isBrowserEnv) return window;
  return {} as Window;
}

//获取全局变量 __virtualMonitor__ 的引用地址
export function getGlobalSupport(): VirtualMonitor {
  _global.__virtualMonitor__ =
    _global.__virtualMonitor__ || ({} as VirtualMonitor);
  return _global.__virtualMonitor__;
}

//判断sdk是否初始化
export function isInit(): boolean {
  return !!_global.__virtualMonitorInit__;
}

const _global = getGlobal();
const _support = getGlobalSupport();

export { _global, _support };
