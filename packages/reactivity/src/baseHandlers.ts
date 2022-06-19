import { isObject } from "@vue-plain/shared"
import { warn, info } from "./warning"
import { trigger, track } from "./effect"
import { TriggerOpTypes, TrackOpTypes } from "./operations"
import { Target, ReactiveFlags, reactive, readonly, readonlyMap, reactiveMap } from "./reactive"

const get = createGetter()
const set = createSetter(true)

const readonlyGet = createGetter(true)

export const mutableHandler: ProxyHandler<object> = {
    get,
    set
}

/**
 * readonly ProxyHandler
 * donot set
 * donot delete
 */
export const readonlyHandlers: ProxyHandler<object> = {
    get: readonlyGet,
    set(target, key) {
        warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target
        )
        // donot change
        return true
    },
    deleteProperty(target, key) {
        warn(
            `Delete operation on key "${String(key)}" failed: target is readonly.`,
            target
        )
        // donot delete
        return true
    }
}

// create proxy getter func
function createGetter(isReadonly = false, shallow = false) {
    return function(target: Target, key: string | symbol, receiver: object) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            warn('reactive')
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            warn('readonly')
            return isReadonly
        } else if (key === ReactiveFlags.IS_SHALLOW) {
            return shallow
        } else if (
            key === ReactiveFlags.RAW &&
            receiver === (
                isReadonly
                ? readonlyMap
                : reactiveMap
            ).get(target)
        ) {
            warn('target')
            // shallow 浅层代理暂时不处理
            return target
        }
        const res = Reflect.get(target, key, receiver)
        info('Get key: ', key)
        info('Get res: ', res)
        // 非只读 —— 收集依赖（只读不会 set，故不用收集依赖）
        if (!isReadonly) {
            track(target, TrackOpTypes.GET, key)
        }

        // 浅层 proxy，直接返回得到的属性即可
        if (shallow) return res

        if (isObject(res)) {
            // 懒代理化，深层对象属性再创建为 proxy
            return isReadonly ? readonly(res) : reactive(res)
        }
        return res
    }
}

// create proxy setter func
function createSetter(shallow = false) {
    return function (
        target: object,
        key: string | symbol,
        value: unknown,
        receiver: object
    ) {
        // let oldValue = (target as any)[key]
        const result = Reflect.set(target, key, value, receiver)

        // 触发 set 时，触发依赖
        trigger(target, TriggerOpTypes.ADD,'set', key)
        return result
    }
}