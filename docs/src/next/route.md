# 基于页面的路由系统

Next.js 的路由系统采用基于**文件系统的页面**（File-system based routing）路由设计。

简单来说，只需要在 `pages` 或 `app` 目录下创建对应的文件，Next.js 会自动根据这些文件的结构生成路由，无需手动配置。

```text
pages/
  index.js         // 访问 /
  about.js         // 访问 /about
  blog/
    index.js       // 访问 /blog
    [id].js        // 访问 /blog/123  (动态路由)
```

在上面的结构中，每个文件都自动对应一个 URL 路径，只需要专注于页面内容本身，路由的生成和管理都交给 Next.js

## 核心功能

### 静态路由 Static Routes

路由器会自动将名为 index 的文件路由到目录的根目录。

- `pages/index.js` → `/`
- `pages/blog/index.js` → `/blog`

### 动态路由 Dynamic Routes

通过中括号语法（如`[id].js`）可以实现动态参数匹配。

- `pages/blog/[slug].js` → `/blog/:slug (/blog/hello-world)`
- `pages/[username]/settings.js` → `/:username/settings (/foo/settings)`
- `pages/post/[...all].js` → `/post/* (/post/2020/id/title)`

### 嵌套路由 Nested Routes

通过文件夹嵌套实现多级路由

- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/dashboard/settings/username.js` → `/dashboard/settings/username`
