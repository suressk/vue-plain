export * from './effect'
export * from './reactive'

import { isArray } from '@vue-plain/shared'

const arr = [1, 2 ,3]
const obj = { name: 'Saul' }

console.log(isArray(arr))
console.log(isArray(obj))