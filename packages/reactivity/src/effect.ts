import { Dep } from './dep'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { warn } from './warning'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export const effect = function () {
  warn('effect')
}

// 数据变更，触发依赖更新
export const trigger = function (
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  warn('trigger')
}

// 依赖收集
export const track = function (
  target: object,
  type: TrackOpTypes,
  key: unknown
) {
  warn('track')
}
