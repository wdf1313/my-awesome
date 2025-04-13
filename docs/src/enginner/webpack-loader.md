# Loader 

webpack 只能理解 JavaScript 和 JSON 文件。**loader** 让 webpack 能够去处理其他类型的文件。

loader 用于对模块的源代码进行转换，当 webpack 遇到 `import/require` 语句时，会根据配置的 loader 对文件内容进行转换。

## 原理 🚧

Loader 执行机制：
- 链式调用（从后向前）：
- pitch 阶段（从左向右）
- 通过 loader-runner 独立执行

## 常用 Loader

### 一、JS/TS Loader

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

### CSS Loader

### 文件资源 Loader