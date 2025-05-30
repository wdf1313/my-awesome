# promise 链式调用

## Promise 链式调用的原理

Promise 的 then、catch、finally 方法都会返回一个新的 Promise，因此可以实现链式调用：

```js
Promise.resolve(1)
  .then((val) => {
    console.log(val) // 1
    return val + 1
  })
  .then((val) => {
    console.log(val) // 2
    return val + 1
  })
```

每次 then/catch/finally 都会返回一个新的 Promise 实例，后续的 then/catch/finally 会在前一个 Promise 结束后依次执行。

## then/catch/finally 的返回值对链式调用的影响

### 不返回值（或返回 undefined）

如果 then/catch 的回调函数没有返回值（即返回 undefined），下一个 then 会接收到 undefined 作为参数：

```js
Promise.resolve(1)
  .then((val) => {
    console.log(val) // 1
    // 没有 return，隐式返回 undefined
  })
  .then((val) => {
    console.log(val) // undefined
  })
```

### 返回普通值

then/catch 的回调如果返回一个普通值，这个值会被包装成一个 resolved 状态的 Promise，传递给下一个 then：

```js
Promise.resolve(1)
  .then((val) => val + 1) // 返回 2
  .then((val) => console.log(val)) // 输出 2
```

### 返回 Promise

如果返回的是一个 Promise，则后续 then 会等待该 Promise 处理完成：

```js
Promise.resolve(1)
  .then((val) => Promise.resolve(val + 1))
  .then((val) => console.log(val)) // 输出 2
```

### 抛出异常/返回 rejected Promise

如果 then/catch 回调中抛出异常，或者返回一个 rejected 状态的 Promise，链会进入 rejected 状态，跳到下一个 catch：

```js
Promise.resolve(1)
  .then((val) => {
    throw new Error("出错了")
  })
  .catch((err) => console.log(err.message)) // 输出 '出错了'
```

### finally 的返回值

finally 不会影响链的值传递，但如果 finally 返回 rejected，则会改变链的状态：

```js
Promise.resolve(1)
  .finally(() => console.log("finally"))
  .then((val) => console.log(val)) // 输出 'finally' 和 1

Promise.resolve(1)
  .finally(() => Promise.reject("error in finally"))
  .then((val) => console.log(val))
  .catch((err) => console.log(err)) // 输出 'error in finally'
```

## Promise 中的错误穿透与优雅捕获

### 错误穿透

如果 then 没有提供 onRejected（失败回调），错误会自动传递到下一个 catch：

```js
Promise.reject("error")
  .then((val) => console.log(val))
  .catch((err) => console.log("捕获到错误:", err)) // 输出 '捕获到错误: error'
```

### 优雅地进行错误捕获

可以在链末尾统一 catch 捕获所有错误，避免每一步都写 catch：

```js
Promise.resolve()
  .then(() => {
    throw new Error("step1 error")
  })
  .then(() => {
    // 不会执行
  })
  .catch((err) => {
    console.log("统一捕获:", err.message)
  })
```

## 如何中断一个 Promise 链

Promise 本身没有"中断"机制，但可以通过返回一个永远 pending 的 Promise 或抛出异常来实现"中断"效果。

### 返回一个永远 pending 的 Promise

```js
function stopChain() {
  return new Promise(() => {}) // 永远不 resolve/reject
}

Promise.resolve()
  .then(() => {
    console.log("step1")
    return stopChain()
  })
  .then(() => {
    // 不会执行
    console.log("step2")
  })
```

### 抛出异常中断后续 then

```js
Promise.resolve()
  .then(() => {
    throw new Error("中断链")
  })
  .then(() => {
    // 不会执行
  })
  .catch((err) => {
    console.log("链被中断:", err.message)
  })
```
