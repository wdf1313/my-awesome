# Loader 

webpack 只能理解 JavaScript 和 JSON 文件。**loader** 让 webpack 能够去处理其他类型的文件。

loader 用于对模块的源代码进行转换，当 webpack 遇到 `import/require` 语句时，会根据配置的 loader 对文件内容进行转换。

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
module.exports = function(source, map, meta) {
  // source: 文件内容
  // map: source map
  // meta: 元数据
  
  // 处理逻辑...
  
  // 返回处理后的内容
  return source; // 同步
  // 或
  this.async(null, source, map, meta); // 异步
};
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
      enforce: 'pre',
      test: /\.js$/,
      loader: 'eslint-loader'
    }
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
      use: ['style-loader', 'css-loader']
    }
  ]
}
```

#### 后置 Loader(Post Loader) 

通过 `enforce: 'post'` 指定，适合需要在其他 Loader 处理后进行处理的情况。

```js
module: {
  rules: [
    {
      enforce: 'post',
      test: /\.js$/,
      loader: 'babel-loader'
    }
  ]
}
```

#### 行内 Loader 

在 `import` 或 `require` 语句中指定，使用 `!` 分隔多个 Loader。优先级高于配置文件中的 Loader

```js
// 使用单个行内 Loader
import Styles from 'style-loader!css-loader!./styles.css';

// 使用多个行内 Loader
import Styles from 'style-loader!css-loader!sass-loader!./styles.scss';

// 禁用普通 Loader
import Styles from '!style-loader!css-loader!./styles.css';

// 禁用前置和后置 Loader
import Styles from '-!style-loader!css-loader!./styles.css';

// 禁用所有配置的 Loader
import Styles from '!!style-loader!css-loader!./styles.css';
```

前缀含义

`!` 禁用普通 Loader 
`-!` 禁用前置和普通 Loader
`!!` 禁用所有配置的 Loader，只使用行内 Loader
