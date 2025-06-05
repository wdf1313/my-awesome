# useReducer

`useReducer` 是 React 提供的一个用于状态管理的 Hook，常用于管理复杂状态逻辑。

## 基础用法

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

`useReducer` 接收三个参数：

- **reducer 函数**：指定如何更新状态的还原函数，必须是纯函数，以 state 和 action 为参数，并返回下一个状态。
- **初始状态**：初始状态的值。
- **初始化函数（可选）**：用于返回初始状态。如果未指定，初始状态将设置为 initialArg；如果有指定，初始状态将被设置为调用 `init(initialArg)` 的结果。

`useReducer` 返回一个数组，包含两个元素：

- **state**：当前状态。在第一次渲染时，它会被设置为 `init(initialArg)` 或 initialArg（如果没有 init 的情况下）。
- **dispatch**：调度函数，用于调用 reducer 函数，以更新状态并触发重新渲染。

### 简单示例

通常情况下只会用到 `useReducer` 的前两个参数，比如这个计数器：

```jsx
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 }
    case "decrement":
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  )
}
```

### 使用 `dispatch` 的注意事项

- `dispatch` 调用后，状态更新是异步的，因此立刻读取状态可能仍是旧的。
- React 对 `dispatch` 有一个优化机制：如果 `dispatch` 触发更新前后的值相等，实际上 React 不会进行重新渲染，这是出于性能考虑。

### 使用 `reducer` 函数的注意事项

在 `reducer` 里面更新对象和数组的状态，需要创建一个新的对象或数组，而不是在原对象和数组上修改。

## 初始化状态：使用 `init` 函数

`useReducer` 的第三个参数用于**惰性初始化** state，只有在 initialArg 需要经过计算得到初始 state 时才用到。

假设计数器的值保存在 `localStorage` 里面，进入页面时从中读取作为 useReducer 初值。如果没有 `init` 可以这样实现：

```jsx
function getInitialCount() {
  const savedCount = localStorage.getItem("count")
  return savedCount ? Number(savedCount) : 0
}

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 }
    case "DECREMENT":
      return { count: state.count - 1 }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, getInitialCount())

  // 使用 useEffect 监听状态变化，并将其保存到 localStorage
  useEffect(() => {
    localStorage.setItem("count", state.count)
  }, [state.count])

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
    </>
  )
}
```

通过直接调用 `getInitialCount` 函数作为 `useReducer` 的第二个参数，从而得到初始状态。当 React 初始化这个组件时，它会执行这个函数并使用其返回值作为初始状态。

如果使用第三个参数进行初始化，代码如下：

```jsx
function init(initialValue) {
  // 尝试从 localStorage 中读取值
  const savedCount = localStorage.getItem("count")

  // 如果有值并且可以被解析为数字，则返回它，否则返回 initialValue
  return { count: savedCount ? Number(savedCount) : initialValue }
}

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 }
    case "DECREMENT":
      return { count: state.count - 1 }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, 0, init) // ❗❗

  // 使用 useEffect 监听状态变化，并将其保存到 localStorage
  useEffect(() => {
    localStorage.setItem("count", state.count)
  }, [state.count])

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
    </>
  )
}
```

这两种实现方式区别在于：

1. **执行时机**：
   - 直接调用函数作为第二个参数会在**每次组件渲染**时执行；
   - 使用 `init` 函数只在**组件初次渲染**时执行一次；
2. **访问到的数据**：
   - 直接调用函数作为第二个参数只能访问到定义它时的作用域内的数据；
   - 使用 `init` 函数接受 `initialArg` 作为参数，使得 `init` 函数更加灵活，能够基于传入的参数进行计算。
3. **性能**：
   - 直接调用函数作为第二个参数如果要执行计算密集或副作用的操作，那么每次渲染都会执行，可能导致性能问题；
   - 使用 `init` 函数，由于它只在组件的初始化阶段执行一次，所以对于那些计算密集的初始化操作，使用 init 函数可能会更为高效。

## 与 `useContext` 一起使用

`useReducer` + `useContext` 可以创建简单的全局状态管理系统。

1. **定义状态、reducer 和 context**

```jsx
const ThemeContext = React.createContext()

const initialState = { theme: "light" }

function themeReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME":
      return { theme: state.theme === "light" ? "dark" : "light" }
    default:
      return state
  }
}
```

2. **创建 Provider 组件**

```jsx
function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        toggleTheme: () => dispatch({ type: "TOGGLE_THEME" }),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
```

3. **在子组件中切换和读取主题**

```jsx
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      style={{ backgroundColor: theme === "light" ? "#fff" : "#000" }}
      onClick={toggleTheme}
    >
      Toggle Theme
    </button>
  )
}
```

## `useReducer` 和 Redux 的主要差异

虽然 useReducer 和 Redux 都采用了 action 和 reducer 的模式来处理状态，但它们在实现和使用上有几个主要区别：

- **作用范围**：useReducer 通常在组件或小型应用中使用，而 Redux 被设计为大型应用的全局状态管理工具。
- **中间件和扩展**：Redux 支持中间件，这允许开发者插入自定义逻辑，例如日志、异步操作等。而 useReducer 本身不直接支持，但我们可以模拟中间件的效果。
- **复杂性**：对于简单的状态管理，useReducer 通常更简单和直接。但当涉及到复杂的状态逻辑和中间件时，Redux 可能更具优势。
