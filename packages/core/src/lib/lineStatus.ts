import { EVENTTYPES } from "../common"
import { debug } from "../utils/debug"
import { _support } from "../utils/global"
import { eventBus } from "./eventBus"

//监听网络状态
export class LineStatus {
    online = true
    constructor() {
        this.init()
    }
    init() {
        eventBus.addEvent({
            type: EVENTTYPES.OFFLINE,
            callback: e => {
                if (e.type === 'offline') {
                    debug('网络已断开')
                    this.online = false
                }
            }
        })
        eventBus.addEvent({
            type: EVENTTYPES.ONLINE,
            callback: e => {
                if (e.type === 'online') {
                    debug('网络已连接')
                    this.online = true
                }
            }
        })
    }
}

export let lineStatus: LineStatus

export function initLineStatus() {
    _support.lineStatus = new LineStatus()
    lineStatus = _support.lineStatus
}