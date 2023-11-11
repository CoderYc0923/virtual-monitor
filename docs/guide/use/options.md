# options

| 名称                | 类型                 | 必填   | 默认值    | 说明                                                                                                             |
| ------------------- | -------------------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------- |
| dns                 | string               | **是** | -         | 上报地址,将收集到的数据根据 dns 地址上报到服务端                                                                 |
| appName             | string               | **是** | -         | 应用名称                                                                                                         |
| appCode             | string               | 否     | -         | 应用 code                                                                                                        |
| appVersion          | string               | 否     | -         | 应用版本                                                                                                         |
| userUuid            | string               | 否     | -         | 用户 id                                                                                                          |
| debug               | boolean              | 否     | false     | 是否开启触发事件时控制台输出                                                                                     |
| pv                  | object/boolean       | 否     | false     | **_暂未支持_**                                                                                                   |
| performance         | object/boolean       | 否     | false     | **_暂未支持_**                                                                                                   |
| error               | object/boolean       | 否     | false     | -                                                                                                                |
| event               | object/boolean       | 否     | false     | **_暂未支持_**                                                                                                   |
| extraInfo           | object               | 否     | undefined | 自定义的全局附加参数,在 `baseinfo` 对象中会带上 `extraInfo` 对象，如果想要传递一些额外的公共数据可通过此参数附加 |
| tracesSampleRate    | number               | 否     | 1         | 抽样发送(0-1)                                                                                                    |
| cacheMaxLength      | number               | 否     | 5         | 上报数据最大缓存数                                                                                               |
| cacheWatingTime     | number               | 否     | 5000      | 上报数据最大等待时间(ms)                                                                                         |
| ignoreErrors        | Array<string/RegExp> | 否     | []        | 错误类型事件过滤                                                                                                 |
| ignoreRequest       | Array<string/RegExp> | 否     | []        | 请求类型事件过滤                                                                                                 |
| scopeError          | boolean              | 否     | false     | 开启批量错误采集,采集 CD 为每隔 20s                                                                              |
| localization        | boolean              | 否     | false     | 是否本地,开启本地化后，数据会存储在 localStorage 中化                                                            |
| sendTypeByXmlBody   | boolean              | 否     | false     | 是否强制指定发送形式为 xml，body 请求方式                                                                        |
| beforePushEventList | function             | 否     | -         | 添加到事件列表前置钩子，可在此对采集到的数据进行自定义增删改查                                                   |
| beforeSendData      | function             | 否     | -         | 数据上报前置钩子，可在此对采集到的数据进行自定义增删改查                                                         |
| afterSendData       | function             | 否     | -         | 数据上报后置钩子，可在此进行数据上报后的收尾操作                                                                 |

## error

当 error 为 Boolean 类型时其内部所有属性都为此 Boolean 值

| 属性名 | 类型    | 是否必填 | 默认值 | 说明                 |
| ------ | ------- | -------- | ------ | -------------------- |
| core   | boolean | 否       | false  | 是否采集异常数据     |
| server | boolean | 否       | false  | 是否采集报错接口数据 |
