//判断是否是批量错误

import { AnyFun } from "../types";
import { throttle, debounce, groupArray } from "../utils";
import { sendData } from "./sendData";

const SETTIMEA = 2000;
const SETTIMEB = 20000;
const MAXLENGTH = 5;
const GROUPARRAYKEY = ["errMessage", "eventId", "requestUrl"];

/**
 * 判断依据
 * 1.将所有错误存入发送栈a
 * 2.发生错误时，通过防抖2秒来查看栈a是否存在[errMessage, eventId, requestUrl]相同且发生个数大于等于5个的错误集
 *      若存在则合并错误集并加入[时间区间，发生个数]参数，然后存入栈B
 *      若不存在则发送错误
 * 3.每次推入错误集到栈b时延迟20s查b栈 并发送这些错误
 * 4.若中途用户关闭网页，统一把a\b栈的错误发送
 * 5.若中途a栈内错误到达50个,统一把a\b栈的错误发送
 */
class BatchError {
  cacheErrorA: any[];
  cacheErrorB: any[];
  throttleProxyAddCacheErrorA: AnyFun;
  throttleProxyAddCacheErrorB: AnyFun;
  constructor() {
    this.cacheErrorA = [];
    this.cacheErrorB = [];
    this.throttleProxyAddCacheErrorA = debounce(
      this.proxyAddCacheErrorA,
      SETTIMEA
    );
    this.throttleProxyAddCacheErrorB = throttle(
      this.proxyAddCacheErrorB,
      SETTIMEB
    );
  }
  proxyAddCacheErrorA() {
    let len = this.cacheErrorA.length;
    if (!len) return;
    const arr = groupArray(this.cacheErrorA, ...GROUPARRAYKEY);
    const arrA = arr.filter((item: any) => item.length < MAXLENGTH);
    const arrB = arr.filter((item: any) => item.length >= MAXLENGTH);
    if (arrA.length) {
      sendData.emit(arrA.flat(Infinity));
    }
    if (arrB.length) {
      const arrBsum: any[] = [];
      arrB.forEach((item: any) => {
        const sumItem = item[0];
        sumItem.batchError = true;
        sumItem.batchErrorLength = item.length;
        sumItem.batchErrorLastHappenTime = item[item.length - 1].triggerTime;
        arrBsum.push(sumItem);
      });
      this.cacheErrorB.push(...arrBsum);
      this.throttleProxyAddCacheErrorB();
    }
    while (len--) {
      this.cacheErrorA.shift();
    }
  }
  proxyAddCacheErrorB() {
    let len = this.cacheErrorB.length;
    if (!len) return;
    const arr = groupArray(this.cacheErrorB, ...GROUPARRAYKEY);
    while (len--) {
      this.cacheErrorB.shift();
    }
    //将区间错误集合并
    const emitList: any[] = [];
    arr.forEach((itemList: any[]) => {
      const sumItem = itemList[0];
      if (itemList.length > 1) {
        sumItem.batchErrorLength = itemList.reduce(
          (p, item) => (p += item.batchErrorLength),
          0
        );
        sumItem.batchErrorLastHappenTime =
          itemList[itemList.length - 1].triggerTime;
      }
      emitList.push(sumItem);
    });
    sendData.emit(emitList);
  }
  //发送所有错误
  sendAllCacheError() {
    const errInfoList = this.cacheErrorA.concat(this.cacheErrorB);
    const arr = groupArray(errInfoList, ...GROUPARRAYKEY);
    const arrA = arr.filter((item: any) => item.length < MAXLENGTH);
    const arrB = arr.filter((item: any) => item.length >= MAXLENGTH);

    if (arrA.length) sendData.emit(arrA.flat(Infinity), true);
    if (arrB.length) {
      const arrBsum: any[] = [];
      arrB.forEach((item: any) => {
        const sumItem = item[0];
        sumItem.batchError = true;
        sumItem.batchErrorLength = item.length;
        sumItem.batchErrorLastHappenTime = item[item.length - 1].triggerTime;
        arrBsum.push(sumItem);
      });
      sendData.emit(arrBsum, true);
    }
  }
  pushCacheErrorA(errorInfo: any) {
    this.cacheErrorA.push(errorInfo);
    this.throttleProxyAddCacheErrorA();
    if (this.cacheErrorA.length >= 50) {
      this.proxyAddCacheErrorA();
      this.proxyAddCacheErrorB();
    }
  }
}

export let batchError: BatchError;

export function initBatchError() {
  batchError = new BatchError();
}
