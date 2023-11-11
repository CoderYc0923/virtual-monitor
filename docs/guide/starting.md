# Start

VirtualMonitor 是一个基于 TavaScript 的埋点 SDK，兼容` vue2` `vue3 `

它支持`行为`、`性能`、`异常`、`请求`、`资源`、`路由`、`曝光`监控功能

::: tip
v1.0.0 版本 仅实现 `异常`监控功能
:::

## 安装

```
// vue2版本
pnpm install @virtual-monitor/vue2

// vue3版本
pnpm install @virtual-monitor/vue3
```

## 使用

```js
//import VirtualMonitor from "@virtual-monitor/vue2";
import VirtualMonitor from "@virtual-monitor/vue3";

Vue.use(VirtualMonitor, {
  dns: "/trackweb",
  appName: "yc",
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  userUuid: "demo_userUuid",

  scopeError: true,

  tracesSampleRate: 0.5,

  ignoreErrors: ["111", /^promise/, /.*split is not .* function/],
  ignoreRequest: [/getAllTracingList/, /cleanTracingList/],

  beforePushEventList(data) {
    const arr = ["intersection", "click"];
    data.forEach((item) => {
      if (arr.includes(item.eventType)) {
        window.vm.sendMessage();
      }
    });
    return data;
  },
  beforeSendData(data) {
    // 返回false代表sdk不再发送
    return data;
  },
  afterSendData(data) {},
});
```
