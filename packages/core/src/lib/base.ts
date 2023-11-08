import { _support, getGlobal } from "../utils/global"
import { DEVICE_KEY, SDK_VERSION } from '../common'
import { load } from '../utils/fingerprintjs'
import { getCookieByName, uuid } from '../utils'
import { getSessionId } from '../utils/session'
import { options } from './options'
import { getIPs } from '../utils/getIps'
import { AnyObj } from '../types'
import { useComputed } from '../observer'
import type { ObserverValue } from '../observer/types'

interface Device {
    clientHeight: number
    clientWidth: number
    colorDepth: number
    pixelDepth: number
    screenWidth: number
    screenHeight: number
    deviceId: string
    vendor: string
    platform: string
}

interface Base extends Device {
    userUuid: string
    sdkUserUuid: string
    extraInfo: AnyObj
    appName: string
    pageId: string
    sessionId: string
    sdkVersion: string
    ip: string
}

export class BaseInfo {
    public base: ObserverValue<Base> | undefined
    public pageId: string
    private sdkUserUuid = ''
    private device: Device | undefined

    constructor() {
        //当前应用Id
        this.pageId = uuid();
        this.initSdkUserUuid().then(() => {
            this.initDevice()
            this.initBase()
        })
    }

    private initDevice() {
        const { screen } = getGlobal()
        const { clientHeight, clientWidth } = document.documentElement
        const { width, height, colorDepth, pixelDepth } = screen
        let deviceId = getCookieByName(DEVICE_KEY)
        if (!deviceId) {
            deviceId = `t_${uuid()}`
            document.cookie = `${DEVICE_KEY}=${deviceId};path=/`
        }
        this.device = {
            clientHeight,//网页可见区高度
            clientWidth,//网页可见宽度
            colorDepth,// 显示屏幕调色板的比特深度
            pixelDepth,// 显示屏幕的颜色分辨率
            deviceId,
            screenWidth: width,// 显示屏幕的宽度
            screenHeight: height,// 显示屏幕的高度
            vendor: navigator.vendor, // 浏览器名称
            platform: navigator.platform // 浏览器平台的环境,x64 or x32
        }
    }

    private initBase() {
        //浏览器与后端之间协定的ID
        const sessionId = getSessionId()
        let ip = ''
        this.base = useComputed<Base>(() => ({
            ...this.device!,
            userUuid: options.value.userUuid,
            sdkUuid: this.sdkUserUuid,
            extraInfo: options.value.extraInfo,
            appName: options.value.appName,
            appCode: options.value.appCode,
            pageId: this.pageId,
            sessionId,
            sdkVersion: SDK_VERSION,
            ip
        }))
        getIPs().then((res: any) => {
            this.base!.value.ip = res[0]
            ip = res[0]
        })
    }

    private initSdkUserUuid() {
        return load({}).then((fp: any) => fp.get).then((res: any) => {
            const visitorId = res.visitorId
            this.sdkUserUuid = visitorId
            options.value.sdkUserUuid = visitorId
        })
    }
}

export let baseInfo: BaseInfo
export function initBase() {
    baseInfo = new BaseInfo()
    _support.baseInfo = baseInfo
}