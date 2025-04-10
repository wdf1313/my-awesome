# var、let、const

| 特性       | var              | let            | const          |
| ---------- | ---------------- | -------------- | -------------- |
| 作用域     | 函数作用域       | 块级作用域     | 块级作用域     |
| 提升       | 声明提升并初始化 | 提升但不初始化 | 提升但不初始化 |
| 重复声明   | 允许             | 不允许         | 不允许         |
| 重新赋值   | 允许             | 允许           | 不允许         |
| 暂时性死区 | 无               | 有             | 有             |

### var

```js
function varExample() {
  console.log(a) // undefined (变量提升)
  if (true) {
    var a = 10
    var a = 20 // 允许重复声明
  }
  console.log(a) // 20 (函数作用域)
}
```

### let

```js
function letExample() {
  // console.log(b); // 报错：暂时性死区
  if (true) {
    let b = 10
    // let b = 20; // 报错：不能重复声明
    b = 30 // 允许重新赋值
  }
  // console.log(b); // 报错：块级作用域
}
```

### const

```js
function constExample() {
  const c = 10
  // c = 20; // 报错：不能重新赋值

  const obj = { x: 1 }
  obj.x = 2 // 允许修改属性
  // obj = {}; // 报错：不能重新赋值
}
```

## 暂时性作用死区

暂时性作用死区是指进入**作用域**到**变量声明**之间的区域，在这期间访问变量会报错。

## for 循环经典问题

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// 输出 3, 3, 3
```

因为 var 没有块级作用域，所以回调共享同一个 `i`。使用 `let` 或者 使用 IIFE 创建闭包

```js
// let
for (let i = 0; i < 3; i++) { ... }

// IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```
