import type { InitOptions } from './src/types'
import { _global } from './src/utils/global'
import { initOptions } from './src/lib/options'

function init(options: InitOptions): void {
    if (_global.__virtualMonitorInit__) return
    if (!initOptions(options)) return
}

export {
    init,
    InitOptions
}
