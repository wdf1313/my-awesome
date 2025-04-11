# Closure

闭包（Closure）是指能够访问其他函数作用域中变量的函数。

## 闭包形成条件

1. 函数嵌套
2. 内部函数引用了外部函数的变量
3. 外部函数被调用

```js
function outer() {
  let count = 0

  function inner() {
    count++
    console.log(count)
  }
  return inner
}

const counter = outer
counter() // 1
counter() // 2
counter() // 3
```

## 闭包的特性及应用场景

1. 记忆性：闭包可以记住创建时的上下文环境
2. 封装性：可以创建私有变量和方法
3. 持久性：闭包的变量会一直保存在内存中，直到闭包不会被引用

### 数据封装与私有变量

JavaScript 没有原生支持私有变量，但是可以通过闭包模拟

```js
function createPerson(name) {
  let privateAge = 0

  return {
    getName: () => name,
    getAge: () => privateAge,
    incrementAge: () => {privateAge++}
  }
}

const person = createPerson("Alice");
console.log(person.getName()); // "Alice"
person.incrementAge();
console.log(person.getAge()); // 1
// 无法直接访问 privateAge
```

### 函数工厂

创建可以生成特定功能函数的函数

```js
function createMultiplier(factor) {
  return function(number) {
    return number * factor
  }
}

const double = createMultiplier(2)
const triple = createMultiplier(3)

console.log(double(5)) // 10
console.log(triple(5)) // 15
```

### 模块模式

实现模块化编程，隐藏实现细节

```js
const calculator = (function() {
  let memory = 0;
  
  return {
    add: function(a, b) {
      const result = a + b;
      memory = result;
      return result;
    },
    subtract: function(a, b) {
      const result = a - b;
      memory = result;
      return result;
    },
    getMemory: function() {
      return memory;
    },
    clearMemory: function() {
      memory = 0;
    }
  };
})();

console.log(calculator.add(5, 3)); // 8
console.log(calculator.getMemory()); // 8
```

### 回调函数与事件处理

闭包常用于保存状态

```js
function setupButtons() {
  const buttons = document.querySelectorAll('button');
  
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      console.log(`Button ${i} clicked`);
    });
  }
}

setupButtons();
```

### 防抖和节流

### 缓存 Memorization

## 为什么闭包可能导致内存泄漏?

闭包可能导致内存泄漏，但这是使用不当的结果。

闭包的特性决定了它会**保持对外部词法环境的引用**。这使得外部函数的作用域**不会被回收**，即使外部函数已执行完毕。只要闭包存在，其**环境中的变量**就会一直**保留**。

### 引起内存泄漏典型场景，保留 DOM 元素引用

```js
function setup() {
  const largeData = new Array(100000).fill('data'); // 大数据
  const button = document.getElementById('myButton')

  button.addEventListener('click', function() {
    // 这个闭包保留了 largeData 和 button 的引用
    console.log('button clicked')
  })
}

setup()
// 即使不再需要 button 和 largeData 它们也不会被回收
```
### 避免闭包引起的内存泄漏

1. 及时移除事件监听器，不再需要时显示解除引用（设为null）

```js
function cleanSetup() {
  const largeData = new Array(100000).fill('data'); // 大数据
  const button = document.getElementById('myButton')

  function handler() {
    console.log('button clicked')
  }

  button.addEventListener('click', handler)

  //  清除机制：不再需要时及时移除事件监听
  return {
    destory: function() {
      button.removeEventListener('click', handler);
      largeData = null
    }
  }
}

const instance = cleanSetup()
// 当不再需要时 
instance.destory()
```

2. 使用 WeakMap/WeakSet 存储大对象

```js
const wm = new WeakMap();

function safeClosure() {
  const largeObj = { /* 大数据 */ };
  const button = document.getElementById('myButton');
  
  wm.set(button, largeObj);
  
  button.addEventListener('click', function() {
    const data = wm.get(button);
    console.log(data);
  });
  
  // 当button被移除时，largeObj会自动被回收
}
```


