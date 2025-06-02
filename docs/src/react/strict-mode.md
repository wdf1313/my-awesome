# React 严格模式

React 的严格模式（Strict Mode）是 React 提供的一种用于突出显示应用中潜在问题的工具。

它不会渲染任何可见的 UI，只会对其后代组件进行额外的检查和警告。

通过在组件树外层包裹 `<React.StrictMode>` 来启用严格模式；

```jsx
import React from "react"
import ReactDOM from "react-dom"

const root = document.getElementById("root")

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

严格模式主要解决和帮助以下潜在问题：

1. 不安全的生命周期方法

检查并警告使用了已废弃或不安全的生命周期方法，如 `componentWillMount`，`componentWillReceiveProps` 等；

2. 意外的副作用

在开发环境下，严格模式会使某些函数组件的生命周期方法执行两次，以帮助你发现副作用是否是幂等的。

:::tip 幂等：无论执行多少次，结果都是一样的。
:::

3. 过时的 ref API

检查并警告使用了旧的字符串 ref API，推荐使用回调函数或 `React.createRef`

4. 检测遗留的 context API

检查并警告使用了旧版的 context API，推荐使用新版的 `React.crateContext`

React 严格模式主要用于开发环境，帮助开发者提前发现和修复潜在的 bug 和不规范用法，提高代码的健壮性和可维护性。它不会影响生产环境的性能和行为
