import { validateMethods } from '../utils'
import { handleSendError } from './error'

//主动触发error事件上报
export function traceError(options = {}, flush = false) {
    if (!validateMethods('traceError')) return
    return handleSendError(options, flush)
}