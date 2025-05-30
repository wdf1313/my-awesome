# Promise

Promise 是 ES6 引入的一种**异步编程**解决方案，用于更优雅地处理异步操作。它代表一个可能还未完成但最终会完成的操作，并返回操作结果。

:::tip 什么是同步？什么是异步？

同步：代码按照顺序一行一行执行，每一行代码都必须等上一行代码执行完毕后才能继续执行下一行。

异步：某些任务可以先开始执行，但不会阻塞后续代码的执行。当异步任务完成后，会通过回调、Promise、async/await 等方式通知主程序处理结果。
:::

## Promise 的三种状态

Promise 有三种状态：

1. **Pending（进行中）**：初始状态，既不是成功，也不是失败。
2. **Fulfilled（已成功）**：操作成功完成。
3. **Rejected（已失败）**：操作失败。

状态一旦改变就不可逆转。

```js
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 成功 */) {
    resolve('成功结果');
  } else {
    reject('失败原因');
  }
});
```

:::tip 为什么 Promise 状态不会改变？

Promise A+ 规范中明确规定，状态只能改变一次，并且不可逆转。

:::

## Promise 的常用 API

### `then`

用于指定 Promise 成功（fulfilled）和失败（rejected）时的回调。

```js
promise.then(
  (value) => {
    /* 成功时回调 */
  },
  (reason) => {
    /* 失败时回调 */
  }
)
```

### `catch`

用于指定 Promise 失败时的回调，是 `then(null, onRejected)` 的语法糖。

```js
promise.catch((error) => {
  console.error(error)
})
```

### `finally`

无论 Promise 最终状态如何，都会执行的回调。

```js
promise.finally(() => {
  console.log("操作已结束")
})
```

### `Promise.resolve`

返回一个状态为 fulfilled 的 Promise。

```js
Promise.resolve(42).then((value) => console.log(value)) // 42
```

### `Promise.reject`

返回一个状态为 rejected 的 Promise。

```js
Promise.reject("出错了").catch((error) => console.error(error))
```

### `Promise.all`

所有 Promise 都成功才成功，有一个失败就失败。

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)]).then((values) =>
  console.log(values)
) // [1, 2]
```

### `Promise.race`

第一个完成（无论成功或失败）的 Promise 决定最终结果。

```js
Promise.race([
  new Promise((resolve) => setTimeout(() => resolve("A"), 100)),
  new Promise((resolve) => setTimeout(() => resolve("B"), 50)),
]).then((value) => console.log(value)) // 'B'
```

### `Promise.allSettled`

等待所有 Promise 都完成（无论成功或失败），返回每个 Promise 的结果对象。

```js
Promise.allSettled([Promise.resolve(1), Promise.reject("error")]).then(
  (results) => console.log(results)
)
```

### `Promise.any`

只要有一个 Promise 成功就返回其结果，全部失败才失败。

```js
Promise.any([Promise.reject("error"), Promise.resolve("ok")]).then((value) =>
  console.log(value)
) // 'ok'
```
