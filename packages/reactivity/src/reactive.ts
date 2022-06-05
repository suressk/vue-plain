import { isObject } from '@vue-plain/shared'
import { mutableHandler, readonlyHandlers } from './baseHandlers'
import { warn } from './warning'

export const enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    IS_SHALLOW = '__v_isShallow',
    RAW = '__v_raw'
}

export interface Target {
    [ReactiveFlags.SKIP]?: boolean
    [ReactiveFlags.IS_REACTIVE]?: boolean
    [ReactiveFlags.IS_READONLY]?: boolean
    [ReactiveFlags.IS_SHALLOW]?: boolean
    [ReactiveFlags.RAW]?: any
}

// 存储深层代理 proxy（懒代理，访问深层数据时，处理为 proxy）
export const reactiveMap = new WeakMap<Target, any>();
// 浅代理 proxy 对象
// export const shallowReactiveMap = new WeakMap<Target, any>()
// // 只读 proxy（深层代理）
export const readonlyMap = new WeakMap<Target, any>();
// // 浅层只读 proxy
// export const shallowReadonlyMap = new WeakMap<Target, any>();

// make value to be reactive
export const reactive = (target: Target) => createReactiveObject(target, false, mutableHandler, reactiveMap)

// make value to be a readonly proxy
export const readonly = <T extends object>(target: T) => createReactiveObject(target, true, readonlyHandlers, readonlyMap)

function createReactiveObject(
    target: Target,
    isReadonly: boolean,
    baseHandler: ProxyHandler<any>,
    proxyMap: WeakMap<Target, any>,
) {
    if (!isObject(target)) {
        warn(`value cannot be made reactive: ${String(target)}`)
        return target
    }
    const existProxy = reactiveMap.get(target)
    // 已经代理过
    if (existProxy) return existProxy
    
    const proxy = new Proxy(target, baseHandler)

    // 把创建好的 proxy 存起来
    proxyMap.set(target, proxy);
    return proxy
}