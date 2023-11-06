import { AnyFun, AnyObj } from '../types'
import { isRegExp, isArray, isFunction, isNumber } from './is'

//添加事件监听器
export function on(
    target: Window | Document,
    eventName: string,
    handler: AnyFun,
    options = false
):void {
    target.addEventListener(eventName,handler, options)
}

//覆写对象原型链上的某个属性
export function replaceAop(
    source: AnyObj,
    name: string,
    repalacement: AnyFun,
    isForced = false
):void {
    if (source === undefined) return
    if (name in source || isForced) {
        const original = source[name]
        const wrapped = repalacement(original)
        if (isFunction(wrapped)) {
            source[name] = wrapped
        }
    }
}



