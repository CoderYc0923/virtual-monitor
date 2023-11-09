// import { Base64 } from 'js-base64'
// import pako from 'pako'

// //压缩
// export function useZip(data: any):string {
//     if (!data) return data
//     const dataJson = (typeof data !== 'string' && typeof data !== 'number') ? JSON.stringify(data) : data
//     const str =  Base64.encode(dataJson as string)
//     const binaryString = pako.gzip(str)
//     const arr = Array.from(binaryString)
//     let s = ''
//     arr.forEach((item: number) => {
//         s += String.fromCharCode(item)
//     })
//     return Base64.btoa(s)
// }

// //获取录屏数据
// export function getEventList() {
//     return recordScreen?.eventList ?? []
// }
