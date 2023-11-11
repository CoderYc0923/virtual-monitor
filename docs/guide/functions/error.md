# Error

页面错误信息收集,收集以下错误类型：

- 资源加载错误,代码异常(error)
- promise 调用链异常(reject)
- console.error 异常

触发事件时生成的对象
| 属性名称 | 值 | 说明 |
| -------------- | ----------------------------------- | ------------------------------ |
| eventId | code / HTML 元素上发生异常则为元素名 | 事件 ID |
| eventType | error | 事件类型 |
| triggerPageUrl | | 当前页面 URL |
| errMessage | | 错误信息 |
| errStack | | 完整的错误信息 |
| line | | 错误信息发生在第几行 |
| col | | 错误信息发生在第几列 |
| recordscreen | | 错误录屏数据 |
| params | | 主动方法触发错误收集可以带参数 |
| sendTime | | 发送时间 |
| triggerTime | | 事件发生时间 |

```js
// 真实场景产生的事件对象
{
  eventId: 'code',
  eventType: 'error',
  errMessage: 'a.split is not a function',
  line: '288',
  col: '9',
  sendTime: 1689728522923,
  triggerTime: 1689728522923,
  triggerPageUrl: 'http://localhost:6657/#/err',
  errStack:
    'TypeError: a.split is not a function\n    at VueComponent.codeError (http://localhost:6656/src/views/err/index.vue:288:9)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at VueComponent.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at Vue2.$emit (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:2034:9)\n    at VueComponent.handleClick (http://localhost:6656/node_modules/.vite/deps/element-ui.js?v=534c31e8:27234:20)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at HTMLButtonElement.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at original._wrapper (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:3934:25)',
}
```

## 批量错误采集

::: tip
为避免某些场景下重复错误过多而产生重复上报的性能浪费，可采用批量错误采集进行优化，开启后 SDK 内部会收集相同错误信息并在 `20s` CD 后发送至服务器<br>

- 单个错误采集会产生 2s 延迟
- 批量错误采集会产生 20s 延迟
- 事件池满了(50 个)会自动发送
  :::

### 开启方式

`scopeError = true`

### 批量错误参数

| 属性名称                 | 值                                   | 说明                           |
| ------------------------ | ------------------------------------ | ------------------------------ |
| eventId                  | code / HTML 元素上发生异常则为元素名 | 事件 ID                        |
| eventType                | error                                | 事件类型                       |
| batchError               |                                      | 是否为批量错误                 |
| batchErrorLastHappenTime |                                      | 批量错误中最后一个错误发生时间 |
| batchErrorLength         |                                      | 批量错误的个数                 |
| triggerPageUrl           |                                      | 当前页面 URL                   |
| errMessage               |                                      | 错误信息                       |
| errStack                 |                                      | 完整的错误信息                 |
| line                     |                                      | 错误信息发生在第几行           |
| col                      |                                      | 错误信息发生在第几列           |
| recordscreen             |                                      | 错误录屏数据                   |
| params                   |                                      | 主动方法触发错误收集可以带参数 |
| sendTime                 |                                      | 发送时间                       |
| triggerTime              |                                      | 事件发生时间                   |

```js
// 真实场景产生的事件对象
{
  eventId: 'code',
  eventType: 'error',
  errMessage: 'a.split is not a function',
  batchError: true,
  batchErrorLastHappenTime: 1689744409113,
  batchErrorLength: 10,
  errStack:
    'TypeError: a.split is not a function\n    at VueComponent.codeError (http://localhost:6656/src/views/err/index.vue?t=1689734427168:288:9)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at VueComponent.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at Vue2.$emit (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:2034:9)\n    at VueComponent.handleClick (http://localhost:6656/node_modules/.vite/deps/element-ui.js?v=534c31e8:27234:20)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at HTMLButtonElement.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at original._wrapper (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:3934:25)\n    at VueComponent.batchErrorA (http://localhost:6656/src/views/err/index.vue?t=1689734427168:325:44)',
  triggerPageUrl: 'http://localhost:6656/#/err',
  line: '288',
  col: '9',
  sendTime: 1689744811726,
  triggerTime: 1689744788264,
  recordscreen: 'H4sIAAAAAAAAA+R9V3vqyNLuD9oXh2C8h0sbm7RA3saYoDuChyQwswATfv2p6iB1' // 错误录屏数据
}
```
