import { AnyFun, ObserverValue } from "./types";
import { Watcher } from "./watcher";
import { OBSERVERSIGNBOARD } from './config'

//计算属性响应式
export class Computed<T> {
    target: ObserverValue<T>
    constructor(target: ObserverValue<T>) {
        this.target = target
    }
    defineReactive() {
        const computedWatcher = new Watcher(this, { computed: true })

        const handlers: ProxyHandler<ObserverValue<any>> = {
            get() {
                if (computedWatcher.proxy.dirty) {
                    computedWatcher.depend()
                    return computedWatcher.get()
                }
                 else {
                    computedWatcher.depend()
                    return computedWatcher.proxy.value
                 }
            }
        }
        return new Proxy<ObserverValue<T>>(this.target, handlers)
    }
}

export const computedMap = new WeakMap<Computed<any>, AnyFun>()

export function computed<T>(fun: AnyFun) {
    const target: any = { value: 0 }
    target[OBSERVERSIGNBOARD] = true
    const ob = new Computed<T>(target)
    const proxy = ob.defineReactive()
    computedMap.set(ob, fun)
    return proxy
}