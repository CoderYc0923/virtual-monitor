import { init, InitOptions } from '@virtual-monitor/core'

function install(app: any, options: InitOptions) {
    init(options)
}

export default { install }
export * from '@virtual-monitor/core'