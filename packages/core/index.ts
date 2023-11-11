import type { InitOptions } from "./src/types";
import { _global } from "./src/utils/global";
import { initOptions, options as _options } from "./src/lib/options";
import { initReplace } from "./src/lib/replace";
import { initBase } from "./src/lib/base";
import { initSendData } from "./src/lib/sendData";
import { initLineStatus } from "./src/lib/lineStatus";
import { initError, parseError } from "./src/lib/error";
import { logError } from "./src/utils/debug";
import { SENDID } from "./src/common";
import * as exportMethods from "./src/lib/exportMethods";

function init(options: InitOptions): void {
  if (_global.__virtualMonitorInit__) return;
  if (!initOptions(options)) return;
  //注册核心
  initCore();
  //注册相关业务
  initBusiness();

  _global.__virtualMonitorInit__ = true;
}

function initCore() {
  //初始化重写监听
  initReplace();
  initBase();
  //初始化发送数据
  initSendData();
  //初始化监听网络状态
  initLineStatus();
}

function initBusiness() {
  //初始化错误埋点相关
  initError();
}

export {
  init,
  InitOptions,
  logError,
  parseError,
  SENDID,
  exportMethods,
  _options as options,
};
export * from "./src/lib/exportMethods";
export default { init, ...exportMethods, options: _options };
