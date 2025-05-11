# Next.js

## 客户端渲染（CSR）VS 服务端渲染（SSR）

### 客户端渲染（Client-Side Rendering, CSR）

- HTML 在客户端（用户的浏览器）通过 JavaScript 渲染。
- 适用于高度交互的单页应用（SPA）。
- 典型代表：React、Vue 等前端框架。

### 服务端渲染（Server-Side Rendering, SSR）

- HTML 在服务端（开发者的服务器）渲染后返回给客户端。
- 适用于内容驱动、对 SEO 有较高要求的网站。
- 典型代表：Next.js、Nuxt.js 等框架。

### 优缺点对比

| 特性         | 客户端渲染（CSR）                     | 服务端渲染（SSR）            |
| ------------ | ------------------------------------- | ---------------------------- |
| 渲染位置     | 客户端（用户浏览器）                  | 服务端（开发者服务器）       |
| 初始加载速度 | 较慢：需下载大包 JS，数据挂载后再获取 | 较快：HTML 和数据一次性返回  |
| 交互性       | 高：所有代码和内容已加载（除数据）    | 较低：页面可能需完整刷新     |
| SEO          | 不友好：搜索引擎难以抓取内容          | 友好：内容易被搜索引擎索引   |
| 典型场景     | 内部工具、登录后应用、SPA             | 电商、博客、新闻、营销网站等 |

## 水合（Hydration）

水合（Hydration）是服务端渲染（SSR）与客户端渲染结合时的一个重要机制。它指的是：浏览器端的 React 应用接管（激活）服务端渲染出来的静态 HTML，使其变为可交互的 React 组件。

其原理是，服务端先将 React 组件渲染为 HTML 字符串，返回给浏览器。浏览器加载页面后，前端 JavaScript 代码会用 React 的 hydrate 或 hydrateRoot 方法，将 React 组件"挂载"到已有的 HTML 上。React 会复用已有的 DOM 节点，只为需要交互的部分添加事件监听等，从而避免了客户端重新渲染整个页面，提高了性能。

例如：

```js
// 服务端渲染
const html = renderToString(<App />)
// 客户端水合
ReactDOM.hydrateRoot(document.getElementById("root"), <App />)
```

水合的意义在于，用户首次访问时，看到的是已经渲染好的 HTML，体验更好；而在 JavaScript 加载后，页面上的按钮、表单等交互功能会被激活。水合是连接 SSR 和客户端 React 的桥梁，让页面既快又能交互，是现代 React/Next.js 应用的重要机制。
