# Monorepo

- 使用 [`pnpm` 🔗](https://www.pnpm.cn/) 做 `Monorepo` 包管理工具

- 项目根路径下创建 `pnpm-worksapce.yaml` 文件：

    ```yaml
    # 指定分包路径
    # packages 目录下的所有包单独管理
    packages:
        - 'packages/*'
    ```

- `packages` 目录下的每一个子包，通过 `package.json` 文件来配置我们需要用到的属性

    ```json
    {
        /* 用于区分各个子包 */
        "name": "@[主包名]/[当前子包名]",
        /* 自定义打包配置 */
        "buildOptions": {
            /* 打包输出包名（一般大驼峰命名） */
            "name": "[自定义包名]",
            /* 打包输出代码规范 */
            "formats": [
                "global",
                "esm-bundler",
                "cjs"
            ]
        },
        // ... others
    }
    ```

- 我们用到了 `typescript`，所以配置 `tsconfig.json`（根目录下创建），避免我们在使用我们自定义的子包时找不到文件的问题

    ```json
    {
        "compilerOptions": {
            // ... others config
            "baseUrl": ".",
            /*
             这样，我们在代码里
             import {xxx} from '@[主包名]/xxx'
             时就可以找到对应的文件了，否则就会找不到文件而报错
             */
            "paths": {
                "@[主包名]/*": ["packages/*/src"]
            },
            "outDir": "dist",
        },
        "include": [
            "packages/*/src"
        ]
    }
    ```

- 通过自定义 shell 命令，结合 node 使用 `esbuild` 对开发环境阶段的代码进行打包转化输出

    ```shell
    node scripts/dev.js [子包名] -f [formats 规范]
    ```

    执行 `scripts/dev.js` 文件，通过 `minimist` 包解析 shell 命令参数，再拿到每个子包的 `package.json` 文件内容，取出我们自己的 `buildOptions` 配置，使用 `esbuild.build` 方法打包输出即可
