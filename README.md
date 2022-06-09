# Vue-Plain

简易版 vue3.0 核心实现

### Monorepo

[Workspace Docs 🔗](/docs/workspace.md)

### goal 1: `esbuild`

use `esbuild` to build source code to be `esm` / `cjs` / `iife`(browser) standard-code

achieve that with shell args: `-f [xxx]`

### goal 2: `reactive`

use `Proxy` make an object to be a proxy-object

> `lazy-proxy`: It means that a property of the object is also an object, when you get it's value, make the property object to be a proxy-object