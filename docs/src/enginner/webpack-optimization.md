# Optimization 

## SplitChunksPlugin

`SplitChunksPlugin` 是 Webpack 内置的代码分割器，用于优化代码拆分（例如提取公共依赖，拆分异步代码块等），减少重复代码，提升缓存利用率。

`splitChunks.cacheGroups` 用于定义如何将匹配特定条件的模块分组到不同的缓存组中，最终生成独立的chunk.

```js
optimization: {
  splitChunks: {
    chunks: 'async',
    minSize: 20000,
    minRemainingSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    enforceSizeThreshold: 50000,
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
}
```

## TerserPlugin 

TerserPlugin 是 WebPack 中用于压缩和优化 JavaScript 代码的核心插件。核心功能：

- 删除未使用的代码
- 删除注释和空白字符
- 缩短变量名
- 优化表达式
- 移除调试语句

```js
optimization: {
  minimizer: [new TerserPlugin({
    parallel: true, // 使用多进程并行运行
    terserOptions: {
      compress: {
        drop_console: true, // 移除console
        drop_debugger: true, // 移除debugger
      },
      output: {
        comments: false, // 移除注释
      },
    },
  })],
}
```


## Tree Shaking 

"将代码想象成一棵树，绿色的叶子代表实际用到的代码，而枯黄的叶子代表未引用的代码" Tree Shaking 就是摇动这棵树，让枯黄（未使用的代码）掉落。

### Tree Shaking 工作原理

1. 依赖关系图构建：webppack 会从入口文件开始，分析所有模块的依赖关系，构建完整的依赖关系图。
2. 静态分析：Webpack 通过静态分析代码，识别出哪些导出 export 被导入 imports 使用，哪些没被使用。这要求代码必须是静态可分析 （ESM） 的。
3. 标记未使用代码：在依赖关系图中，标记哪些导出没有被任何模块使用。
4. 消除死代码：在最终打包时，移除哪些被标记为未使用的代码。
5. 副作用分析：识别并保留那些未被显示使用但具有副作用的代码。

### 启用 Tree Shaking

确保代码中使用 ESM语法，在 Webpack 中生产环境 `production` 下默认启用，也可手动配置

```js
// webpack.config.js
module.exports = {
  mode: 'production', // 生产模式会自动启用 tree shaking
  optimization: {
    usedExports: true, // 识别出被使用的导出
    minimize: true,   // 压缩代码，移除未被使用的导出
  }
};
```

在 `package.json` 中添加 "sideEffects" 属性

```js
{
  "name": "your-project",
  "sideEffects": false
}

// 或者指出有副作用的文件
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

:::warning
确保 `Babel` 不会讲 ES6 模块转换为 `CommonJS` 模块。在 `.babelrc` 或者 `.babel.config.js` 中设置

```json
{
  "presets": [
    ["@babel/preset-env", { "modules": false }]
  ]
}
```
:::