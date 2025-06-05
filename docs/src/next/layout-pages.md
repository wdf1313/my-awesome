# Layout And Page

## 什么是 Page

在 Next.js 的 app 目录下，`page.tsx`（或 `page.jsx`）文件用于定义具体的页面内容。每个 `page.tsx` 文件自动对应一个路由。例如

- `app/page.tsx` -> `/`
- `app/about/page.tsx` -> `/about`
- `app/blog/[slug]/page.tsx` -> `/blog/xxx`

**Page 的职责：**

- 渲染当前路由下的主要内容
- 处理页面级的数据请求和业务逻辑
- 只负责本页面独有的内容

**代码示例：**

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return <h1>关于我们</h1>
}
```

## 什么是 Layout

`layout.tsx` 文件用于定义页面的布局结构。每个文件夹下都可以有一个 `layout.tsx`，它会包裹该目录下所有的 page 和 子路由。

Layout 组件在路由切换时不会被写在，只有其内部的 page 内容会变化。

**Layout 的职责**

- 提供页面的结构和复用，比如导航栏、侧边栏、页脚等
- 可以嵌套，实现多层布局
- 适合放全局 Provide 、主题、骨架屏等

**代码示例：**

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <header>导航栏</header>
        <main>{children}</main>
        <footer>页脚</footer>
      </body>
    </html>
  )
}
```

## Layout 和 Page 的关系

layout 是 page 的“外壳”，page 是具体的页面内容。访问某个页面时，Next.js 会先渲染最近的 layout，然后在 layout 里渲染 page。

layout 可以嵌套，比如 `/dashboard/layout.tsx` 会包裹 `/dashboard/page.tsx`。如果 `/dashboard/settings/layout.tsx` 存在，则会进一步包裹 `/dashboard/settings/page.tsx`

**目录结构示例：**

```text
app/
  layout.tsx         // 顶层布局
  page.tsx           // 首页
  about/
    page.tsx         // 关于页
  dashboard/
    layout.tsx       // dashboard 专属布局
    page.tsx         // dashboard 首页
    settings/
      page.tsx       // dashboard 下的设置页
```

访问 `/dashboard/settings` 时，渲染顺序是：`app/layout.tsx` → `dashboard/layout.tsx` → `settings/page.tsx`
