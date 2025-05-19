# JSX

JSX（JavaScript XML）是一种 JavaScript 的**语法扩展**，可以让我们在 JavaScript 文件中书写类似 HTML 的标签。例如：

```jsx
const element = <h1>Hello, world!</h1>;
```

这段代码不是浏览器原生能识别的 JavaScript，需要经过 Babel 转译成标准的 JavaScript 代码：

```js
const element = React.createElement('h1', null, 'Hello, world!');
```

JSX 本身不是字符串，也不是 HTML，最终会被编译成 `React.createElement` 的函数调用。

:::tip
React.createElement 会生成一个 "虚拟 DOM" 对象，后续会根据这个对象渲染真实 DOM。
:::

JSX 允许你在标签属性和内容中嵌入任意 JavaScript 表达式，但所有内容都会被 React 自动转义，只有显式使用 `dangerouslySetInnerHTML` 才会插入未转义的 HTML。这也是 React 防止 XSS 的重要机制之一
