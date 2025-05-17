# Webpack

Webpack 是一种用于构建 JavaScript 应用程序的静态模块打包器，能够以一致且开放的方式加载应用中的所有资源文件（如图片、CSS、视频、字体文件等），并将其合并打包为浏览器兼容的 Web 资源文件。

Webpack 将所有代码和非代码文件统一视为 Module（模块对象），通过相同的加载、解析、依赖管理、优化、合并流程实现打包。借助 Loader 和 Plugin 两种开放接口，将资源差异处理逻辑交由社区实现，从而实现统一资源构建模型。此设计具备以下优点：

- 所有资源均为 Module，可用同一套代码实现代码压缩、热模块替换（Hot Module Replacement）、缓存等特性；
- 打包时，资源间信息互换变得容易，例如可在 HTML 中插入 Base64 格式图片；
- 借助 Loader，几乎可用任意方式处理任意类型资源，如 Less、Stylus、Sass 等预编译 CSS 代码。

Webpack 的高度开放性，使其成为前端工程化环境的基座。围绕 Webpack 可接入多种工程化工具，如 TypeScript、CoffeScript、Babel 等 JavaScript 编译工具，Less、Sass、Stylus、PostCSS 等 CSS 预处理器，以及 Jest、Karma 等测试框架。

这些工具在不同方面补充了 Webpack 的工程化能力，使其成为统一的资源处理框架，满足现代 Web 工程在效率、质量、性能等方面的需求，适用于小程序、微前端、SSR、SSG、桌面应用、NPM 包等多种场景。因此，Webpack 依然是当前最广泛使用的构建工具之一。

## Webpack 配置项结构化理解

Webpack 原生提供了上百种配置项，这些配置项最终作用于打包过程的不同阶段。其打包过程大致可简化为：

1. **输入**：从文件系统读入代码文件；
2. **模块递归处理**：调用 Loader 转译 Module 内容，并将结果转换为 AST，分析模块依赖关系，递归处理所有依赖文件；
3. **后处理**：所有模块递归处理完毕后，执行模块合并、注入运行时、产物优化等操作，最终输出 Chunk 集合；
4. **输出**：将 Chunk 写出到外部文件系统。

从打包流程角度，Webpack 配置项可分为两类：

- **流程类**：作用于打包流程某个或若干环节，直接影响编译打包效果的配置项；
- **工具类**：打包主流程之外，提供更多工程化工具的配置项。

### 流程类配置项

与打包流程强相关的配置项包括：

- **输入输出**：
  - `entry`：定义项目入口文件，Webpack 从这些入口文件开始递归查找所有项目文件；
  - `context`：项目执行上下文路径；
  - `output`：配置产物输出路径、名称等；
- **模块处理**：
  - `resolve`：配置模块路径解析规则，提升模块查找效率和准确性；
  - `module`：配置模块加载规则，指定不同类型资源使用的 Loader；
  - `externals`：声明外部资源，Webpack 跳过这些资源的解析与打包；
- **后处理**：
  - `optimization`：控制产物包体积优化，如 Dead Code Elimination、Scope Hoisting、代码混淆与压缩等；
  - `target`：配置编译产物的目标运行环境（如 web、node、electron），不同值影响最终产物结构；
  - `mode`：编译模式，支持 `development`、`production` 等，用于声明环境。

Webpack 首先根据输入配置（`entry`/`context`）定位项目入口文件，随后根据模块处理配置（`module`/`resolve`/`externals` 等）逐一处理模块文件，包括转译、依赖分析等。模块处理完毕后，最后根据后处理相关配置项（`optimization`/`target` 等）合并模块资源、注入运行时依赖、优化产物结构。

### 工具类配置项

除核心打包功能外，Webpack 还提供一系列提升研发效率的工具配置项，主要包括：

- **开发效率类**：
  - `watch`：配置持续监听文件变化，实现持续构建；
  - `devtool`：配置产物 Sourcemap 生成规则；
  - `devServer`：配置开发服务器功能，支持 HMR；
- **性能优化类**：
  - `cache`：Webpack 5 后用于控制编译过程信息与结果的缓存方式；
  - `performance`：配置产物大小超阈值时的通知方式；
- **日志类**：
  - `stats`：精确控制编译过程日志内容，便于性能调试；
  - `infrastructureLogging`：控制日志输出方式，如输出到磁盘文件；
- 其他。

## 配置逻辑综合解析

以下为一个简单示例，展示 Webpack 配置设计过程。示例文件结构：

```text
.
├── src
|   └── index.js
└── webpack.config.js
```

其中，`src/index.js` 为项目入口文件，`webpack.config.js` 为 Webpack 配置文件。

在配置文件中，首先声明项目入口：

```js
// webpack.config.js
module.exports = {
  entry: "./src/index",
}
```

随后，声明产物输出路径：

```js
// webpack.config.js
const path = require("path")

module.exports = {
  entry: "./src/index",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
}
```

至此，已可驱动最简单项目的编译工作。
