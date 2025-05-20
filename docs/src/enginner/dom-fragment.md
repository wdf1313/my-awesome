# DOM Fragment

`DocumentFragment` 是一种轻量级的 DOM 容器，不属于 DOM 树本身。对 fragment 的操作不会引发页面重排和重绘，适合批量构建和插入节点，提升性能。

常见用法：先在 fragment 中批量创建元素，最后一次性插入到页面。

示例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Dom Fragment</title>
  </head>
  <body>
    <div class="container"></div>
  </body>

  <script>
    // ❌ 性能差：每次循环都修改 innerHTML，频繁回流重绘
    // const container = document.querySelector(".container")
    // for (let i = 0; i < 10000; i++) {
    //   container.innerHTML += `<div class="item">Item ${i}</div>`
    // }

    // ✅ 性能较好：字符串拼接，最后一次性插入
    // let container = document.querySelector(".container")
    // let content = ""
    // for (let i = 0; i < 10000; i++) {
    //   content += `<div class="item">Item ${i}</div>`
    // }
    // container.innerHTML = content

    // ✅ 性能最佳：使用 DocumentFragment，避免多次回流重绘
    const container = document.querySelector(".container")
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < 10000; i++) {
      const item = document.createElement("div")
      item.className = "item"
      item.textContent = `Item ${i}`
      fragment.appendChild(item)
    }
    container.appendChild(fragment)
  </script>
</html>
```

## Vue2.x 渲染与 Fragment

Vue2.x 使用 `DOM Fragment` 作为中间层，批量处理 DOM 节点，避免频繁操作主 DOM，提升渲染性能。

Vue2 的 Virtual DOM（虚拟 DOM）渲染逻辑是基于一个前提：组件的根节点只能有一个。

所以，当你写一个组件返回多个根节点（多个 div、p 等），Vue2 是不允许的，会报错。

但是 Vue2 在一些内部处理时，比如：

- Vue 模板编译器解析 `v-for` 时，需要生成多个子节点，Vue 会把这些节点构建在 `DocumentFragment` 中，处理完后一次性插入目标位置。

- 组件 slot 返回多个元素（比如多个 slot 节点）

- 组件挂载阶段的真实 DOM 构建使用 fragment

当一个 Vue 组件挂载时（执行`vm.$mount()`），Vue 会：

1. 把模板编译成渲染函数
2. 执行 `render` 函数返回虚拟 DOM；
3. 调用 `__patch__()`把虚拟 DOM 转换为真实 DOM；

在真实 DOM 插入页面前，Vue 会先用 `DocumentFragment` 承载这些 DOM 节点。



