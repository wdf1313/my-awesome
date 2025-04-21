# Plugin

Webpack Plugin 用于扩展 webpack 的功能，包括资源优化、环境变量注入、打包优化...

Plugin 可以直接触及 webpack 的编译过程，能够 hook 到每一个编译中发出的关键事件中。

## 常用内置 Plugin

### HtmlWebpackPlugin

核心功能

- 自动生成包含正确资源引用的 HTML
- 自动将 webpack 打包生成的 JS、CSS 等资源注入到 HTML 中，正确处理 hash 文件名。

```js
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  // ...其他 webpack 配置
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5-demo",
      template: "./public/index.html",
      filename: "index.html",
      favicon: "./public/favicon.ico",
      minify: {
        collapseWhitespace: isProduction, // 删除空格
        removeComments: isProduction, // 删除注释
        removeRedundantAttributes: isProduction, // 删除多余属性
        removeScriptTypeAttributes: isProduction, // 删除script类型属性
        removeStyleLinkTypeAttributes: isProduction, // 删除style类型属性
      },
      meta: {}, // 添加 meta 标签
      chunks: [], // 指定要包含的 chunk
    }),
  ],
}
```

### DefinePlugin

DefinePlugin 是 Webpack 内置插件，用于在**编译阶段**创建全局常量。这些常量会被直接替换为定义的值，可以在代码中使用.

对字符串始终使用 `JSON.stringify()`，否则会作为变量名解析。

```js
import webpack from "webpack"

plugins: [
  new Webpack.DefinePlugin({
    API_URL: JSON.stringify("https://api.example.com"),
  }),
]
```

### CleanWebpackPlugin

webpack 5+ 已内置为 `output.clean`，在每次构建前清理 `optput` 目录

### HotModuleReplacementPlugin

webpack 内置，启动模块热更新

```js
devServer: {
  hot: true,
},
```

### BundleAnalyzerPlugin

可视化分析打包体积 `npm install --save-dev webpack-bundle-analyzer`

每个矩阵的大小表示文件在打包后的大小

- 左侧面板：显示生成的 bundle 文件
- 主视图：显示选中 bundle 的详细组成
  - start ：原始文件大小（未经 webpack 处理）
  - Parsed：经过 webpack 处理后的文件大小
  - Gzipped：经过 gzip 压缩后的文件大小

通过分析报告可以：

- 识别过大依赖：查找占用空间异常大的第三方库，考虑使用更轻量级的替代方案
- 检查重复依赖：查看是否有一个库被多次打包，使用 webpack 的 `splitChunks` 优化
- 分析代码分割效果：检查按需加载的代码是否合理分割，优化分割策略减少初始化加载时间
- 识别未使用的代码：查找从未被引用的模块，使用 `Tree Shaking` 删除无用代码
