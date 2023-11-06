import { name, version } from '../../package.json'

export const DEVICE_KEY = '_virtualmonitor_device_id' //设备ID_KEY
export const SESSION_KEY = '_virtualmonitor_session_id' //会话ID_KEY
export const SURVIVIE_MILLI_SECONDS= 1800000 //会话session存活时长(30分钟)
export const SDK_LOCAL_KEY = '_virtualmonitor_localization_key' // 事件本地化的key
export const SDK_VERSION = version
export const SDK_NAME = name