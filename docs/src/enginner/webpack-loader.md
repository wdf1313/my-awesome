# Loader 

webpack 只能理解 JavaScript 和 JSON 文件。**loader** 让 webpack 能够去处理其他类型的文件。

loader 用于对模块的源代码进行转换，当 webpack 遇到 `import/require` 语句时，会根据配置的 loader 对文件内容进行转换。

## 原理 🚧

Loader 执行机制：
- 链式调用（从后向前）：
- pitch 阶段（从左向右）
- 通过 loader-runner 独立执行

## 常用 Loader

### JS/TS Loader

`babel-loader` 将 ES6+ 代码转换为向后兼容的 JS 语法，以便能够在旧版浏览器中运行。

```bash
npm install --save-dev @babel-core babel-loader @babel/preset-env
```

- `@babel-core`：负责代码的解析(parse)、转换(transform)和生成(generate)
- `babel-loader`：让 Webpack 在打包时调用 Babel
- `@babel/preset-env`：智能预设，决定转换哪些新语法，避免手动设置。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { 
              targets: "> 0.5%, not dead", // 兼容市场占有率 > 0.5%，且未废弃的浏览器
              useBuiltIns: 'usage', // 按需引入 polyfill 
              corejs: 3 // 指定 core-js 版本
            }]
          ],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }
  ]
}
```

工作流程 `Webpack → babel-loader → @babel/core → @babel/preset-env → 转换后的代码`

如果代码运行在 IE11 等老版本浏览器中可能会遇到代码转换了，但某些 API （例如 Promise）仍然报错。是因为 `@babel/preset-env` 默认只转换语法，不处理 API。

解决方案：配置 `useBuiltIns:usage` + 安装 `core-js`

`core-js` 是 JavaScript 的标准库 polyfill，提供 ES5、ES6+ 甚至未来提案中的 API 的实现。

```bash
npm install core-js@3
```

`useBuiltIns:usage` 只 polyfill 代码中用到的 API，打包体积优化。

:::tip polyfill

Polyfill（也叫 垫片）是一段 JavaScript 代码，用于在现代浏览器中模拟原生不支持的 API 或语法，让旧浏览器也能运行新特性。

:::

### CSS\SASS\PostCSS\Style Loader

```bash
npm install --save-dev css-loader style-loader sass-loader
```

- `style-loader` 将 CSS 通过 `<style>` 注入到 DOM 中
- `css-loader` 解析 CSS 文件，处理 CSS 中的依赖关系（如 @import 和 url() 等）
- `sass-loader` 将 SASS/SCSS 文件转换为 CSS

```js
module.exports = {
  module: {
    rules: [
      // 处理 CSS 文件
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // 处理 Sass/SCSS 文件
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
}
```

#### CSS Module

CSS Module 是将 CSS 作用域限定在组件级别的方法，可以有效避免全局样式污染和命名冲突问题。

```js
{
  loader: 'css-loader',
  options: {
    // modules: true  启用 CSS 模块
    modules: {
      mode: 'local', // 可选 'local' | 'global' | 'pure'
      localIdentName: '[path][name]__[local]--[hash:base64:5]', // 类名生成规则
      exportLocalsConvention: 'camelCase', // 类名导出格式
      hashPrefix: 'my-custom-hash', // 自定义 hash 前缀
      auto: (resourcePath) => resourcePath.endsWith('.module.css') // 自动启用模块化
    }
  }
}
```

- mode:

  - `local`: 默认值，启用局部作用域
  - `global`: 禁用局部作用域
  - `pure`: 只处理纯选择器（不含 :global 或 :local 的）

- localIdentName: 类名生成模板，可用占位符：

  - `[path]`: 文件路径
  - `[name]`: 文件名
  - `[local]`: 原始类名
  - `[hash:base64:5]`: 5 位 base64 哈希值

- exportLocalsConvention:
  - `camelCase`: 导出驼峰格式（默认）
  - `camelCaseOnly`: 只导出驼峰格式
  - `dashes`: 保留破折号
  - `dashesOnly`: 只保留破折号

使用示例

在 React 组件中使用

```jsx
import React from "react"
import styles from "./Button.module.css"

function Button() {
  return <button className={styles.primary}>Click me</button>
}

export default Button
```

在 Vue 组件中使用

```vue
<template>
  <button :class="$style.primary">Click me</button>
</template>

<style module>
.primary {
  background-color: blue;
  color: white;
}
</style>
```

#### PostCSS-Loader

PostCSS-Loader 是 webpack 中用于处理 CSS 的 loader，充当 PostCSS 工具链与 webpack 之间的桥梁。

PostCSS 是一个用 JavaScript 编写的 **CSS 处理工具**，通过插件体系让开发者可以转换、优化和处理 CSS 代码。

```bash
npm install postcss postcss-loader --save-dev
```

推荐在 postcss.config.js 中配置

```js
// postcss.config.js
import autoprefixer from "autoprefixer"
import postcssPresetEnv from "postcss-preset-env"

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ["last 2 versions", ">1%"],
    }),
    postcssPresetEnv(),
  ],
}
```

```js
// webpack 配置简化
{
  test: /\.css$/i,
  use: ['style-loader', 'css-loader', 'postcss-loader']
}
```

#### MiniCssExtractPlugin 生产环境打包优化

MiniCssExtractPlugin 用于将 CSS 提取到单独的页面中（而不是打包到 JavaScript 文件中或者通过 style 标签内联到 HTML 中）

减少 JS 文件体积、利用浏览器并行加载 CSS 和 JS、支持 CSS 文件缓存

```bash
npm install --save-dev mini-css-extract-plugin
```

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // 替代 style-loader
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
}
```

### 文件资源

**Webpack 5 已内置资源模块**

```js
{
  test: /\.(png|jpe?g|gif|webp)(\?.*)?$/, // 图片处理
  type: "asset",
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024, // 4KB
    },
  },
  generator: {
    filename: "images/[name].[hash:8][ext]",
  },
},
{
  test: /\.(svg|woff2?|eot|ttf|otf)(\?.*)?$/, // 字体文件处理
  type: "asset/resource",
  generator: {
    filename: "fonts/[name].[hash:8][ext]",
  },
},
```

使用 `asset` 类型会根据文件大小自动选择：

- 小于 4KB 的图片会被转换为 base64 编码，直接内联到代码中
- 大于 4KB 的图片会被输出为单独的文件

输出的图片文件会放在 `images` 目录下，文件名格式为：原名称 + 8 位 hash + 原扩展名

使用 `asset/resource` 类型，所有匹配的文件会被输出为单独的文件，不进行 base64 转换

**Webpack 4 方案**

```bash
npm install --save-dev file-loader url-loader
```

- `file-loader` 将文件复制到输入目录，返回文件最终的 Public URL
-
- `url-loader` 将小文件转换为 Data URLs(base64)，否则退回到 file-loader

```js
{
  test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
  use: [
    {
      loader: "url-loader",
      options: {
        limit: 4096, // 4KB 以下转为 base64
        name: "images/[name].[hash:8].[ext]",
        esModule: false, // 解决 Vue 中的 img src 问题
      },
    },
  ],
},
{
  test: /\.(svg|woff2?|eot|ttf|otf)(\?.*)?$/,
  use: [
    {
      loader: "file-loader",
      options: {
        name: "fonts/[name].[hash:8].[ext]",
      },
    },
  ],
},
```
