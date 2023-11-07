import { ObserverValue, voidFun, AnyFun } from "./types"
import { ref as _ref } from "./ref"
import { computed as _computed } from "./computed"
import { watch as _watch } from "./watch"

//响应式hooks
function hasProxy() :boolean {
    return !!window.Proxy
}

function useRef<T>(target: T) {
    return hasProxy() ? _ref<T>(target) : { value: target }
}

function useComputed<T>(fun: AnyFun) {
    return hasProxy() ? _computed<T>(fun) : {value: fun()}
}

function useWatch<T>(target: ObserverValue<T>, fun: voidFun<T>) {
    return hasProxy() ? _watch<T>(target, fun) : () => ({})
}

export { useRef, useComputed, useWatch }