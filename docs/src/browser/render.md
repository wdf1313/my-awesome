# 浏览器渲染原理详解

浏览器渲染页面的核心流程如下：

1. 解析 HTML，构建 DOM 树
2. 解析 CSS，构建 CSSOM 树
3. 合成渲染树（Render Tree）
4. 布局（Layout/Reflow）
5. 绘制（Paint）
6. 合成（Composite）

## 1. 解析 HTML，构建 DOM 树

浏览器接收到 HTML 文档后，会从上到下、边解析边构建 DOM（Document Object Model）树。

HTML 解析器会将**标签、属性、文本节点**等转化为 DOM 节点，形成树状结构。

解析过程中遇到外部资源（如 `<script>`、`<link>`、`<img>` 等）会发起**并行请求**以下载资源。

遇到同步脚本（如未加 `async`/`defer` 的 `<script>`）会**阻塞 DOM 解析**，直到脚本执行完毕。

## 2. 解析 CSS，构建 CSSOM 树

浏览器会收集来自不同来源的 CSS，包括：

- 外部样式表 `<link rel="stylesheet">`，浏览器会阻塞渲染，直到样式下载并分析完成
- `<style>` 标签中嵌入的样式
- 元素 `style` 属性

收集后通过词法分析和语法分析将原始的 CSS 文本转化为可供样式计算使用的 CSSOM 树。例如：

```html
<style>
  body { font-size: 16px; }
  .title { color: blue; }
</style>
```

构建出的 CSSOM 类似于

```css
 CSSOM
├── Rule: body { font-size: 16px; }
└── Rule: .title { color: blue; }
```

之所以说 CSS 会阻塞渲染是因为：**CSSOM 构建完成前，不能进行样式计算，也无法开始渲染树构建。**

但 CSSOM 构建**不会阻塞 DOM 解析**，两者是并行构建的。


## 3. 合成渲染树

渲染树（Render Tree）结合了 DOM 和 CSSOM，包含页面中所有需要显示的**可见节点**。

渲染树会过滤掉如 `display: none` 的节点，但会保留 `visibility: hidden` 的节点（占位但不可见）。

每个渲染树节点都包含内容和**计算后的样式信息**。

## 4. 布局（Layout/Reflow）

浏览器根据渲染树计算每个节点的**几何信息**（位置、大小、边距等），这个过程称为布局或回流。

布局是一个自顶向下的递归过程，父节点的尺寸和位置会影响子节点。

触发布局的常见操作有：窗口大小变化、元素尺寸/位置变化、内容变化等。

频繁的布局会影响性能，应尽量减少。

## 5. 绘制（Paint）

浏览器将渲染树的每个节点转换为实际像素，绘制到屏幕的多个图层上。

绘制包括文本、颜色、阴影、边框、图片等视觉效果。

复杂的样式（如渐变、阴影、大量图片）会增加绘制开销。

## 6. 合成（Composite）

1. 浏览器会根据 DOM + CSS + stacking context （堆叠上下文）构建出多个图层（layer）。一些元素）（如 `position: fixed`、`transform`、`will-change` 等）都会被提升为独立的合成图层。
2. 每个图层会被划分成多个小块, 图块将交给 GPU 或 CPU 绘制为**位图**（bitmap），这个过程被称为"光栅化管线"。
3. 将所有图层的位图**合成**到一张屏幕上，考虑图层的顺序（z-index / 堆叠上下文）、图层透明度、裁剪、变化等。这一步通常由 GPU 完成。
4. 合成完成后，最终的图像被提交给 GPU 的缓冲帧（frame buffer），并显示到屏幕上。


## 重排（Reflow）与重绘（Repaint）
 浏览器为了针对页面的重排和重绘，进行了渲染自身优化-渲染队列，浏览器会讲所有的回流重绘的操作放在一个队列，进行批处理
### 重排

结构或布局属性变化会触发重排，如：

- 元素尺寸 / 位置变化
- 元素插入 / 删除
- 浏览器窗口尺寸变化

浏览器需重新结算几何属性，性能开销较大。

## 常见一些引起重排的操作

1. 页面的首次渲染
2. 浏览器的窗口重新计算大小
3. 元素尺寸内容发生变化，字体大小发生变化
4. 激活css伪类

## 常见引起重绘的操作

1. color,borderground相关属性
2. outline一些属性
3. border-radius,visibility,box-shadow

### 重绘

样式变化但不影响布局时（如颜色、背景、边框）会触发重绘，不涉及布局计算，性能开销较小。

| 类型      | 是否影响布局 | 性能开销 | 示例          |
| ------- | ------ | ---- | ----------- |
| Reflow  | ✅ 是    | 高    | 改变宽度、高度、位置等 |
| Repaint | ❌ 否    | 较低   | 改变颜色、背景、阴影等 |

重排一定会引起重绘，重绘不一定会引起重排。

## 为什么使用 `transform` 能减少不必要的重排？

使用 `transform`（如 `transform: translateX(100px)`）来移动或缩放元素时，不会影响元素在文档流中的位置和大小，也不会影响其他元素的布局。

transform 只会触发合成（Composite），不会引发重排（Reflow），性能开销极小。适合菜单收缩、弹窗动画、拖拽等场景。

示例：

```html
<div class="container">
  <div class="sidebar"></div>
  <div class="main"></div>
</div>
```

```css
.container {
  position: relative;
}
.sidebar {
  position: absolute; // 避免影响右侧布局 layout
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: #333;
  transition: transform 0.3s ease;
  will-change: transform; // 提前创建图层
}
.sidebar.closed {
  transform: translateX(-100%);
}
.main {
  margin-left: 200px;
  transition: margin-left 0.3s ease;
  will-change: margin-left;
}
.sidebar.closed ~ .main {
  margin-left: 0;
}
```
## 一些减少重排的方法
1. 尽量使用css动画，他可以调用GPU渲染
2. 操作dom，尽量操作低层级的dom
3. 减少使用table布局
4. 使用css样式 