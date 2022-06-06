const { build } = require('esbuild')
const { resolve, relative } = require('path')
// 打包命令参数: node scripts/dev.js reactivity -f global
// 得到 { _: ['reactivity'], f: 'global' }
const args = require('minimist')(process.argv.slice(2))

// console.log('args: ', args)

const target = args._[0] || 'vue'
const format = args.f || 'global'
// const inlineDeps = args.i || args.inline
// 拿到每个包的 package.json，得到我们自己配的 buildOptions 配置项
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

// 打包输出格式
const outputFormat =
  format === 'global' ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

// 输出文件路径及文件名
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

// 相对 root 的打包结果路径
const relativeOutfile = relative(process.cwd(), outfile)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    onRebuild(error) {
      if (!error) console.log(`rebuilt: ${relativeOutfile}`)
    }
  }
}).then(() => {
  console.log(`watching: ${relativeOutfile}`)
})
