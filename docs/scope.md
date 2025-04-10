# 作用域

作用域是指程序变量、函数和对象的可访问范围，它决定了代码中各部分的可见性。

## 作用域类型

### 全局作用域 Global Scope

在函数和代码块之外定义的变量，整个程序都可以访问.浏览器环境中，全局作用域是 `window` 对象。

```js
var globalVar = "我在全局作用域";
function test() {
  console.log(globalVar); // 可以访问
}
```

### 函数作用域 Function Scope

在函数内部定义的变量，只有函数内能访问

```js
function myFunction() {
  var functionScoped = "我在函数作用域内";
  console.log(functionScoped); // 可以访问
}
console.log(functionScoped); // 报错：未定义
```

### 块级作用域 Block Scope

由 `{}` 包围的代码块形成的作用域，`let` 和 `const` 声明的变量具有块级作用域。

```js
if (true) {
  let blockScoped = "我在块级作用域内";
  const alsoBlockScoped = "我也是";
}
console.log(blockScoped); // 报错
```
