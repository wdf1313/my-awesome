# useState

`useState` 用于在函数组件中添加和管理“状态”

## 初始化状态

### 基础定义

```jsx
const [age, setAge] = useState(40)
```

### 懒初始化

对于需要计算得到的初始状态，可以使用函数传递给 `useState`。这样函数只在初次渲染时执行，而非每次渲染。

```jsx
const [todos, setTodos] = useState(createInitialTodos)
```

## 更新状态

### 直接更新 VS 函数式更新

大部分情况，直接更新状态即可；

```jsx
setAge(newState)
```

但当新状态依赖前一个状态时，推荐使用函数式更新。这确保了更新准确性，特别是在并发模式下。

```jsx
setState((prevState) => prevState + 1)
```

以下两个例子展示函数式更新的重要性：

```jsx
// 示例1: 使用函数式更新
import { useState } from "react"

export default function Counter() {
  const [age, setAge] = useState(42)

  function increment() {
    setAge((a) => a + 1) // 函数式更新
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button
        onClick={() => {
          increment()
          increment()
          increment()
        }}
      >
        +3
      </button>
    </>
  )
}
// 结果：点击 +3 时，age 更新为 45。
```

```jsx
// 示例1: 使用函数式更新
import { useState } from "react"

export default function Counter() {
  const [age, setAge] = useState(42)

  function increment() {
    setAge((a) => a + 1) // 函数式更新
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button
        onClick={() => {
          increment()
          increment()
          increment()
        }}
      >
        +3
      </button>
    </>
  )
}
// 结果：点击 +3 时，age 更新为 45。
```

### 对象与数组的更新

对象和数组的更新需要创建新的引用，而不是修改原状态。

```jsx
setForm({
  ...form,
  name: e.target.value, // 更新这个属性
})

// 错误示例：
// form.name = e.target.value
```

```jsx
setTodos([
  ...todos,
  {
    id: nextId++,
    title: title,
    done: false,
  },
])

// 错误示例
// todos.push({
//   id: nextId++,
//   title: title,
//   done: false
// });
// setTodos(todos);
```

### 函数更新

如果想在状态中存储一个函数，需要使用一个箭头函数来“包裹”它。

```jsx
const [fn, setFn] = useState(() => someFunction)

function handleClick() {
  setFn(() => someOtherFunction)
}
```

通常不会使用，但在某些特定的场景下会用到。比如动态切换回调/策略模式

有时候需要根据用户操作或业务逻辑，动态切换某个回调函数的实现。

```jsx
function fnA() { alert('A'); }
function fnB() { alert('B'); }

const [fn, setFn] = useState(() => fnA);

<button onClick={() => fn()}>执行</button>
<button onClick={() => setFn(() => fnB)}>切换到B</button>
```
