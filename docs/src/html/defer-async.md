# defer、async

`defer` 和 `async` 都是用来控制外部 Javascript 脚本加载和执行行为的属性。

默认情况下（不使用 async 或 defer），浏览器遇到 script 标签时会：

1. 暂停 HTML 文档解析
2. 立即下载并执行脚本
3. 脚本执行完成后继续解析文档

这种同步加载方式会阻塞页面渲染，影响用户体验。

`async` 使脚本异步加载，下载过程不阻塞 HTML 解析，脚本下载完成后立即执行（可能中断 HTML 解析）。按照加载完成顺序执行（不可预测），执行时 DOM 可能未完全解析。

`defer` 使脚本异步加载，下载过程不阻塞 HTML 解析。在 HTML 解析完成后，`DOMContentLoaded` 事件前执行。**按照文档顺序执行**，保证在 DOM 解析完成后执行。

分析脚本执行顺序

```js
<script src="a.js"></script>
<script async src="b.js"></script>
<script defer src="c.js"></script>
```

执行顺序：

1. `a.js` 默认，立即阻塞执行
2. `b.js` async 下载完立即执行，可能在 `a.js` 之前或之后，取决于下载速度。
3. `c.js` defer HTML 解析完成后执行

## 性能问题

当脚本完全独立，不依赖 DOM 或其他脚本时，使用 `async`。当脚本需要访问完成 DOM 或依赖其他脚本时使用 `defer`.
