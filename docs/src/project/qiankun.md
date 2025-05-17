# Qiankun

使用 umimax 分别创建了父应用和子应用，父应用采用 `config/config.ts` 配置，子应用采用 `.umirc.ts` 配置。

## 配置父应用

### 插件注册子应用

修改父应用的 `config/config.ts` 文件，添加如下内容

```ts
export default defineConfig({
  qiankun: {
    master: {
      apps: [{ name: "app1", entry: "//localhost:8001" }],
    },
  },
})
```

`name` 为子应用为子应用的名称，在引入子应用时需要使用到它；`entry` 为子应用运行的 HTTP 地址；

## 配置子应用

修改子应用的 `.umirc.ts` 文件，添加内容如下：

```ts
export default defineConfig({
  qiankun: {
    slave: {},
  },
})
```

## 通过路由绑定引入子应用

修改父应用的 `routes.ts` 文件，添加内容如下：

```ts
export default [
  ...,
  {
    // 带上 * 通配符意味着将 /app1/project 下所有子路由都关联给微应用 app1
    name: "子应用app1",
    locale: "menu.app1",
    path: "/app1/project/*",
    microApp: "app1",
  },
]
```

配置好后，子应用的路由 base 会在运行时被设置为主应用中配置的 `path`。
