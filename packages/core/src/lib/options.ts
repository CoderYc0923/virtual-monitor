import { ObserverValue } from "../observer/types";
import { AnyFun, AnyObj, InitOptions, InternalOptions, VoidFun } from "../types";
import { deepAssign } from "../utils";

//全局参数
export class Options implements InternalOptions {
  dns = "";
  appName = "";
  appCode = "";
  appVersion = "";
  userUuid = "";
  sdkUserUuid = "";
  debug = false;
  pv = {
    core: false, //是否自动发送路由添砖相关数据
  };
  performance = {
    core: false, //是否采集静态资源、接口的相关数据
    firstResource: false, //是否采集首次进入页面的数据
    server: false, //接口成功后是否采集接口请求
  };
  error = {
    core: false, // 是否采集异常数据(资源引入错误,promise错误,控制台输出错误)
    server: false, // 是否采集报错接口数据
  };
  event = {
    core: false, // 是否采集点击事件
  };
  recordScreen = false; //是否启动录屏
  extraInfo = {};
  tracesSampleRate = 1;
  cacheMaxLength = 5;
  cacheWatingTime = 5000;
  ignoreRequest: Array<string | RegExp> = [];
  ignoreErrors = [];
  scopeError = false;
  localization = false;
  sendTypeByXmlBody = false;
  beforePushEventList: AnyFun[] = [];
  beforeSendData: AnyFun[] = [];
  afterSendData: VoidFun[] = [];
  localizationOverFlow: VoidFun = () => {};

  constructor(initOptions: InitOptions) {
    const _options = this.#transtionOptions(initOptions);
    _options.ignoreRequest.push(new RegExp(_options.dns));
    deepAssign<Options>(this, _options);
  }

  //对入参进行数据转换
  #transtionOptions(options: InitOptions): Options {
    const _options = deepAssign<Options>({}, this, options);
    const { beforePushEventList, beforeSendData, afterSendData } = options;
    const { pv, performance, error, event } = _options;

    if (typeof pv === "boolean") _options.pv = { core: pv };
    if (typeof performance === "boolean")
      _options.performance = {
        core: performance,
        firstResource: performance,
        server: performance,
      };
    if (typeof error === "boolean")
      _options.error = { core: error, server: error };
    if (typeof event === "boolean") _options.event = { core: event };

    if (beforePushEventList)
      _options.beforePushEventList = [beforePushEventList];
    if (beforeSendData) _options.beforeSendData = [beforeSendData];
    if (afterSendData) _options.afterSendData = [afterSendData];

    return _options
  }
}

export let options: ObserverValue<InternalOptions>
