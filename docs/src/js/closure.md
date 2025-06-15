# 闭包 Closure

闭包是指能够访问其他函数作用域中变量的函数。

## 什么是闭包

闭包是指 **函数在创建时保留了对其定义作用域的引用**，即使函数执行在其词法作用域之外，也能访问该作用域中的变量。

闭包形成：函数嵌套函数，内部函数引用了外部函数的变量，外部函数被调用。

由于 JavaScript 的函数是**一等公民**，可以作为值返回、传递或保存，因此在外部函数返回后，闭包依然保留对外部变量的访问权限。

```js
function outerFn() {
  let count = 0

  function innerFn() {
    count++
    console.log(count)
  }
  return inner
}

const counter = outerFn()
counter() // 1
counter() // 2
counter() // 3
```

在上述代码中，`innerFn` 是一个闭包，他可以访问 `outerFn` 中的变量 `count` 即使 `outerFn` 已经执行完毕。

## 内存泄漏

内存泄露是指程序中已经不再使用的内存空间无法释放，导致这部分内存一直占用着系统资源，最终可能导致性能下降、卡顿、甚至程序崩溃。

闭包可能导致内存泄漏，但这是使用不当的结果。

## 闭包导致内存泄漏

闭包的特性决定了它会**保持对外部词法环境的引用**。这使得外部函数的作用域**不会被回收**，即使外部函数已执行完毕。只要闭包存在，其**环境中的变量**就会一直**保留**。

### 未清理的事件监听

如果事件监听器应用了外部作用域中的变量，且在不需要时未移除，则会导致闭包一直存在，无法释放。

```js
function setup() {
  const largeData = new Array(100000).fill("data") // 大数据
  const button = document.getElementById("myButton")

  button.addEventListener("click", function () {
    // 这个闭包保留了 largeData 和 button 的引用
    console.log(largeData)
  })
}

setup()
// 即使不再需要 button 和 largeData 它们也不会被回收
```

及时移除事件监听器，不再需要时显示解除引用（设为 null）

```js
function cleanSetup() {
  const largeData = new Array(100000).fill("data") // 大数据
  const button = document.getElementById("myButton")

  function handler() {
    console.log(largeData)
  }

  button.addEventListener("click", handler)

  //  清除机制：不再需要时及时移除事件监听
  return {
    destory: function () {
      button.removeEventListener("click", handler)
      largeData = null
    },
  }
}

const instance = cleanSetup()
// 当不再需要时
instance.destory()
```

### 定时器未清理

在定时器的回调函数中使用了闭包，但在不再需要时未清除定时器，导致回调函数及其引用的外部变量无法被回收。

```js
function createTimer() {
  const largeData = new Array(10000).fill("*")
  setInterval(function () {
    console.log(largeData) // 定时器闭包持有 largeData 的引用
  }, 1000)
}

createTimer()
// 这里如果不清除定时器，largeData 将永远无法释放
```

及时移除定时器任务，不再需要时显示解除引用（设为 null）

```js
function createTimer() {
  const largeData = new Array(10000).fill("*")
  const timerId = setInterval(function () {
    console.log(largeData) // 定时器闭包持有 largeData 的引用
  }, 1000)

  // 返回清理函数
  return {
    destroy: function () {
      clearInterval(timerId)
      largeData = null // 解除引用
    },
  }
}

const timer = createTimer()
// 当不再需要定时器时调用清理函数
timer.destroy()
```

## 循环引用导致内存泄漏

JS 的垃圾回收机制使用标记清除（mark-and-sweep）算法。垃圾回收器会从根对象（如全局对象）出发，查找所有可达对象。

若对象形成了循环引用，且不在被根对象访问，则垃圾回收器无法将其清楚，这回导致对象长期保留在内存中，形成内存泄漏。

```js
function createCircularReference() {
  const objectA = {}
  const objectB = {}
  objectA.ref = objectB // objectA 引用 objectB
  objectB.ref = objectA // objectB 引用 objectA，形成循环引用
}

createCircularReference()
// 这里 objectA 和 objectB 都无法被回收
```

在这个示例中， `objectA` 和 `objectB` 互相引用，形成了循环引用。如果没有外部引用它们，按理说可以被垃圾回收，但由于相互持有的引用，导致它们无法被清除，形成了内存泄漏。

## 检测循环引用

1. 使用开发者工具 Memory 面板 Heap snapshot 来查看对象的引用关系，并检查是否有意外的循环引用。
2. 使用 `JSON.stringify` 序列化对象，如果对象存在循环引用会抛出 `TypeError` 异常。只能用于减仓场景

## 避免循环引用导致的内存泄漏

1. 避免对象互相引用
2. 使用 `WeakMap` 或 `WeakSet`：`WeakMap` 和 `WeakSet` 是弱引用结构，存储在其中的对象不会被阻止垃圾回收。可以使用 `WeakMap` 和 `WeakSet` 来存储对象间的引用关系。

```js
const weakMap = new WeakMap()
const objectA = {}
const objectB = {}

weakMap.set(objectA, objectB)
```

3. 在不需要时手动断开引用，设置为 `null` 或者 `undefined`
