import { isFunction } from '@vue-plain/shared'
// import { ReactiveEffect } from "./effect"
import { ReactiveFlags } from './reactive'
import { warn } from './warning'

export type ComputedGetter<T> = (...args: any[]) => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

class ComputedRefImpl<T> {
  private _value!: T

  public readonly [ReactiveFlags.IS_READONLY]: boolean = false

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    // this.effect = new ReactiveEffect()

    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    return this._value
  }

  set value(newVal: T) {
    this._setter(newVal)
  }
}

export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
  // debugOptions?: any
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)

  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => {
      warn('Computed value is readonly')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter)

  return cRef
}
