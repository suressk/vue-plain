import { isObject } from '@vue-plain/shared'
import { mutableHandler } from './baseHandlers'

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
// export const readonlyMap = new WeakMap<Target, any>();
// // 浅层只读 proxy
// export const shallowReadonlyMap = new WeakMap<Target, any>();

// make value to be reactive
export const reactive = function(target: Target) {
    return createReactiveObject(target, mutableHandler, reactiveMap)
}

function createReactiveObject(
    target: Target,
    baseHandler: ProxyHandler<any>,
    proxyMap: WeakMap<Target, any>,
) {
    if (!isObject(target)) {
        console.warn(`value cannot be made reactive: ${String(target)}`)
        return target
    }
    const existProxy = reactiveMap.get(target)
    if (existProxy) return existProxy
    
    const proxy = new Proxy(target, baseHandler)

    // 把创建好的 proxy 给存起来，
    proxyMap.set(target, proxy);
    return proxy
}