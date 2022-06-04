import { Target } from "./reactive"

const get = createGetter()
const set = createSetter(true)

export const mutableHandler: ProxyHandler<object> = {
    get,
}

function createGetter(isReadonly = false, shallow = false) {
    return function(target: Target, key: string | symbol, recevier: object) {

    }
}

function createSetter(shallow = false) {
    return function (
        target: object,
        key: string | symbol,
        value: unknown,
        receiver: object
    ) {
        let oldValue = (target as any)[key]

    }
}