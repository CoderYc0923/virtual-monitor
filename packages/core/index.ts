import type { InitOptions } from './src/types'
import { _global } from './src/utils/global'
import { initOptions } from './src/lib/options'
import { initReplace } from './src/lib/replace'

function init(options: InitOptions): void {
    if (_global.__virtualMonitorInit__) return
    if (!initOptions(options)) return
    //注册核心
    initCore()
}

function initCore() {
    //初始化重写监听
    initReplace()
}

export {
    init,
    InitOptions
}
