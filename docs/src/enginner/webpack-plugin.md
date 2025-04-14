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
      minify: {}, // 压缩 HTML
    }),
  ],
}
```
