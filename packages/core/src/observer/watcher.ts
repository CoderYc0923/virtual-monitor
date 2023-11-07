import { Dep } from './dep'
import { computedMap } from './computed'
import { AnyFun, Options, Proxy } from './types'

const targetStack: Watcher[] = []

function pushTarget(_target: Watcher) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

function popTarget() {
    Dep.target = targetStack.pop()
}

export class Watcher {
    vm: any
    computed: boolean
    watch: boolean
    proxy: Proxy
    dep: Dep | undefined
    getter: AnyFun | undefined
    callback: AnyFun | undefined
    constructor(vm: any, options: Options, getter?:AnyFun) {
        const { computed, watch, callback } = options
        this.getter = getter //获取值函数
        this.computed = computed || false //是否为计算属性
        this.watch = watch || false //是否为监听属性
        this.callback = callback  //watch的回调函数
        this.proxy = {
            value: '', //存储属性值
            dirty: true //标记是否为脏数据
        }
        this.vm = vm

        if (computed) this.dep = new Dep()
        else if (watch) this.watchGet()
        else this.get()
    }
    update(oldValue: any) {
        if (this.computed) this.dep!.notify()
        else if (this.watch) {
            //触发watch
            if(oldValue !== this.proxy.value) {
                this.callback && this.callback(this.proxy.value, oldValue)
            }
        } else {
            //更新data，触发依赖其的属性更新
            this.get()
        }
    }
    get() {
        //存入当前上下文到依赖
        //表示当前是哪个属性在依赖其他属性，这样在其他属性发生变化时就知道该通知谁了
        pushTarget(this)

        //目前只有计算属性才会调用get方法
        const value = this.computed ? computedMap.get(this.vm)!.call(this.vm) : ''
        if (value !== this.proxy.value) {
            this.proxy.dirty = false //标记为不是脏数据
            this.proxy.value = value //缓存数据，在不为脏数据时直接拿这个缓存值
        }
        popTarget() //取出依赖
        return value
    }
    watchGet() {
        pushTarget(this)
        this.proxy.dirty = false
        if (this.getter) this.proxy.value = this.getter() //设定值
        popTarget()
    }
    depend() {
        //添加依赖
        this.dep!.addSub()
    }
}