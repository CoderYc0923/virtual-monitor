import { deepAssign } from "."
import { SendData } from "../types"

//工具类: 操作localstorage
export class LocalStorageUtil {
    static maxSize = 5 * 1024 * 1000 //内存为5MB

    static getItem(key: string) {
        const value = localStorage.getItem(key)
        if (value) return JSON.parse(value)
        return null
    }

    static setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    }

    static removeItem(key: string) {
        localStorage.removeItem(key)
    }

    private static getBytes(str: string): number {
        const blob = new Blob([str])
        return blob.size
    }

    static getSize(): number {
        let size = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key) {
                const value = localStorage.getItem(key)
                if (value) size += this.getBytes(value)
            }
        }
        return size
    }

    static setSendDataItem(key: string, value: SendData) {
        if (this.getSize() >= this.maxSize) return false
        const localItem = (this.getItem(key) || {
            baseInfo:{},
            eventInfo: []
        }) as SendData

        const newItem: SendData = {
            baseInfo: deepAssign(localItem.baseInfo, value.baseInfo),
            eventInfo: localItem.eventInfo.concat(value.eventInfo)
        }

        this.setItem(key, newItem)
        return true
    }
}