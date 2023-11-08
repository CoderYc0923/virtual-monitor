import { options } from "../lib/options";

//控制台打印信息
export function debug(...args: any[]): void {
    if (options.value.debug) console.log('@virtual-monitor', ...args)
}

//控制台打印报错信息
export function logError(...args: any[]): void {
    console.error('@virtual-monitor', ...args)
}