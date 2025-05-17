# Loader

webpack 只能理解 JavaScript 和 JSON 文件。**loader** 让 webpack 能够去处理其他类型的文件。

loader 用于对模块的源代码进行转换，当 webpack 遇到 `import/require` 语句时，会根据配置的 loader 对文件内容进行转换。

## Babel Loader

ECMAScript 6.0(简称 ES6) 版本补充了大量提升 JavaScript 开发效率的新特性，包括 `class` 关键字、块级作用域、ES Module 方案、代理与反射等，使得 JavaScript 可以真正被用于编写复杂的大型应用程序，但知道现在浏览器、Node 等 JavaScript 引擎都或多或少存在兼容性问题。为此，现代 Web 开发流程中通常会引入 Babel 等转译工具。

Babel 是一个开源 JavaScript 转编译器，它能将高版本 —— 如 ES6 代码等价转译为向后兼容，能直接在旧版 JavaScript 引擎运行的低版本代码，例如：

```js
// 使用 Babel 转译前
arr.map((item) => item + 1)

// 转译后
arr.map(function (item) {
  return item + 1
})
```

示例中高版本的箭头函数语法经过 Babel 处理后被转译为低版本 `function` 语法，从而能在不支持箭头函数的 JavaScript 引擎中正确执行。借助 Babel 我们既可以始终使用最新版本 ECMAScript 语法编写 Web 应用，又能确保产物在各种环境下正常运行。

> 提示：Babel 还提供了一个在线版的 REPL 页面，读者可在 [babeljs.io/repl](https://link.juejin.cn/?target=https%3A%2F%2Fbabeljs.io%2Frepl) 实时体验功能效果。

Webpack 场景下，只需使用 `babel-loader` 即可接入 Babel 转译功能：

```bash
npm install -D @babel-core @babel/preset-env babel-loader
```

2. 添加模块处理规则

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
    ],
  },
}
```

示例中，`module` 属性用于声明模块处理规则，`module.rules` 子属性则用于定义针对什么类型的文件使用哪些 Loader 处理器，上例可解读为：

- `test: /\.js$/`：用于声明该规则的过滤条件，只有路径名命中该正则的文件才会应用这条规则，示例中的 `/\.js$/` 表示对所有 `.js` 后缀的文件生效
- `use`：用于声明这条规则的 Loader 处理器序列，所有命中该规则的文件都会被传入 Loader 序列做转译处理

3. 执行编译命令

```
npx webpack
```

接入后，可以使用 `.babelrc` 文件或 `rule.options` 属性配置 Babel 功能逻辑，例如：

```js
// 预先安装 @babel/preset-env
// npm i -D @babel/preset-env
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
}
```

`@babel/preset-env` 是一种 Babel 预设规则集 —— Preset，这种设计能按需将一系列复杂、数量庞大的配置、插件、Polyfill 等打包成一个单一的资源包，从而简化 Babel 的应用、学习成本。Preset 是 Babel 的主要应用方式之一，社区已经针对不同应用场景打包了各种 Preset 资源，例如：

- [`babel-preset-react`](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fbabel-preset-react)：包含 React 常用插件的规则集，支持 `preset-flow`、`syntax-jsx`、`transform-react-jsx` 等；
- [`@babel/preset-typescript`](https://link.juejin.cn/?target=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fen%2Fbabel-preset-typescript)：用于转译 TypeScript 代码的规则集
- [`@babel/preset-flow`](https://link.juejin.cn/?target=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fen%2Fbabel-preset-flow%2F)：用于转译 [Flow](https://link.juejin.cn/?target=https%3A%2F%2Fflow.org%2Fen%2Fdocs%2Fgetting-started%2F) 代码的规则集

- `@babel-core`：负责代码的解析(parse)、转换(transform)和生成(generate)
- `babel-loader`：让 Webpack 在打包时调用 Babel
- `@babel/preset-env`：智能预设，决定转换哪些新语法，避免手动设置。

工作流程 `Webpack → babel-loader → @babel/core → @babel/preset-env → 转换后的代码`

## TS loader

Webpack 有很多种接入 TypeScript 的方法，包括 `ts-loader`、`awesome-ts-loader`、 `babel-loader`。通常可使用 `ts-loader` 构建 TypeScript 代码：

1. 安装依赖

```bash
npm i -D typescript ts-loader
```

2. 配置 Webpack

```js
const path = require("path")

module.exports = {
  /* xxx */
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
}
```

- 使用 `module.rules` 声明对所有符合 `/\.ts$/` 正则 —— 即 `.ts` 结尾的文件应用 `ts-loader` 加载器
- 使用 `resolve.extensions` 声明自动解析 `.ts` 后缀文件，这意味着代码如 `import "./a.ts"` 可以忽略后缀声明，简化为 `import "./a"` 文件

3. 创建 `tsconfig.json` 配置文件，并补充 TypeScript 配置信息

```json
// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "moduleResolution": "node"
  }
}
```

4. 执行编译命令

```
npx webpack
```

## Eslint

Webpack 下，可以使用 `eslint-webpack-plugin` 接入 ESLint 工具，步骤：

1. 安装依赖

```bash
# 安装 eslint
npm i -D eslint eslint-webpack-plugin

# 简单起见，这里直接使用 standard 规范
npm i -D eslint-config-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node
```

2. 在项目根目录添加 `.eslintrc` 配置文件，内容：

```json
// .eslintrc
{
  "extends": "standard"
}
```

> 提示：关于 ESLint 配置项的更多信息，可参考：[eslint.org/docs/user-g…](https://link.juejin.cn/?target=https%3A%2F%2Feslint.org%2Fdocs%2Fuser-guide%2Fconfiguring%2F)

3. 添加 `webpack.config.js` 配置文件，补充 `eslint-webpack-plugin` 配置：

```js
// webpack.config.js
const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")

module.exports = {
  entry: "./src/index",
  mode: "development",
  devtool: false,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  // 添加 eslint-webpack-plugin 插件实例
  plugins: [new ESLintPlugin()],
}
```

4. 执行编译命令

```
npx webpack
```

配置完毕后，就可以在 Webpack 编译过程实时看到代码风格错误提示：

### 样式 Loader

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

## 原理

Loader 本质上是一个函数，接收源文件内容（或前一个 Loader 的处理结果），然后返回转换后的内容。

### Loader 执行流程：

1. 解析模块路径：webpack 遇到 require/import 语句时，解析文件路径

2. 匹配 Loader：根据 module.rules 配置匹配对应的 Loader

3. 构建 Loader 链：按照从右到左的顺序构建 Loader 执行链

4. 执行 Loader：依次调用每个 Loader

5. 生成 AST：将最终结果转换为抽象语法树(AST)

6. 分析依赖：找出模块中的依赖关系

7. 生成 chunk：将模块加入对应的 chunk

### Loader 输入输出

```js
// loader 基本结构
module.exports = function (source, map, meta) {
  // source: 文件内容
  // map: source map
  // meta: 元数据

  // 处理逻辑...

  // 返回处理后的内容
  return source // 同步
  // 或
  this.async(null, source, map, meta) // 异步
}
```

在 loader 函数中，`this` 指向 loader context 对象，提供了一些属性和方法：

- `this.async()` 声明异步回调
- `this.addDependency()` 添加文件依赖
- `this.cacheable()` 设置是否可缓存
- `this.emitFile()` 输出文件
- `this.emitWarning()` 发出警告
- `this.loaderIndex` 当前 loader 在链中的索引

### Loader 类型

#### 前置 Loader

通过 `enforce: 'pre'` 指定，优先执行。适合需要在其他 Loader 处理前进行预处理的情况

```js
module: {
  rules: [
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "eslint-loader",
    },
  ]
}
```

#### 普通 Loader

没有 `enforce` 属性，在前置 Loader 之后，后置 Loader 之前执行。

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
  ]
}
```

#### 后置 Loader(Post Loader)

通过 `enforce: 'post'` 指定，适合需要在其他 Loader 处理后进行处理的情况。

```js
module: {
  rules: [
    {
      enforce: "post",
      test: /\.js$/,
      loader: "babel-loader",
    },
  ]
}
```

#### 行内 Loader

在 `import` 或 `require` 语句中指定，使用 `!` 分隔多个 Loader。优先级高于配置文件中的 Loader

```js
// 使用单个行内 Loader
import Styles from "style-loader!css-loader!./styles.css"

// 使用多个行内 Loader
import Styles from "style-loader!css-loader!sass-loader!./styles.scss"

// 禁用普通 Loader
import Styles from "!style-loader!css-loader!./styles.css"

// 禁用前置和后置 Loader
import Styles from "-!style-loader!css-loader!./styles.css"

// 禁用所有配置的 Loader
import Styles from "!!style-loader!css-loader!./styles.css"
```

前缀含义

`!` 禁用普通 Loader
`-!` 禁用前置和普通 Loader
`!!` 禁用所有配置的 Loader，只使用行内 Loader
